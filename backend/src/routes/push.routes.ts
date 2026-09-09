import { Router } from 'express';
import webpush from 'web-push';
import { z } from 'zod';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

function initVapid() {
  const pub = process.env.VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  const subj = process.env.VAPID_SUBJECT ?? 'mailto:admin@genericmed.app';
  if (pub && priv) {
    webpush.setVapidDetails(subj, pub, priv);
  }
}
initVapid();

const subscriptions = new Map<string, webpush.PushSubscription>();

const subscribeSchema = z.object({
  subscription: z.object({
    endpoint: z.string().url(),
    keys: z.object({
      p256dh: z.string(),
      auth: z.string(),
    }),
  }),
});

router.get('/vapid-public-key', (_req, res) => {
  const key = process.env.VAPID_PUBLIC_KEY;
  if (!key) {
    res.status(503).json({ error: 'Push notifications not configured.' });
    return;
  }
  res.json({ publicKey: key });
});

router.post('/subscribe', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const { subscription } = subscribeSchema.parse(req.body);
    subscriptions.set(req.auth!.userId, subscription as webpush.PushSubscription);
    res.status(201).json({ message: 'Subscribed to push notifications.' });
  } catch {
    res.status(400).json({ error: 'Invalid subscription payload.' });
  }
});

router.delete('/unsubscribe', requireAuth, (req: AuthenticatedRequest, res) => {
  subscriptions.delete(req.auth!.userId);
  res.status(204).send();
});

router.post('/send-test', requireAuth, async (req: AuthenticatedRequest, res) => {
  const sub = subscriptions.get(req.auth!.userId);
  if (!sub) {
    res.status(404).json({ error: 'No push subscription found. Please enable notifications first.' });
    return;
  }
  try {
    await webpush.sendNotification(
      sub,
      JSON.stringify({
        title: 'GenericMed — Test Notification',
        body: 'Push notifications are working! You\'ll receive dose reminders and order updates here.',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        tag: 'test',
      })
    );
    res.json({ message: 'Test notification sent.' });
  } catch (err) {
    console.error('Push send error:', err);
    res.status(500).json({ error: 'Failed to send push notification.' });
  }
});

export async function pushToUser(
  userId: string,
  payload: { title: string; body: string; tag?: string; url?: string }
): Promise<void> {
  const sub = subscriptions.get(userId);
  if (!sub) return;
  try {
    await webpush.sendNotification(
      sub,
      JSON.stringify({ icon: '/icons/icon-192.png', badge: '/icons/icon-192.png', ...payload })
    );
  } catch {
    subscriptions.delete(userId);
  }
}

export { router as pushRouter };
