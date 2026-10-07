# Instagram DM automation: "EARLY ACCESS" with a follow check

The flow the reel shows:

```
Viewer DMs "EARLY ACCESS"  (or comments it on the reel)
        │
        ▼
Bot: "Hi! 👋 Quick check before early access: are you following @doctorj.in?"
        │
        ├── Follows ──────► "Verified ✓ you're following! Here's your early-access link 👇"
        │                    [ sketchroot.com · Join early access with your Gmail ]
        │
        └── Not following ► "Follow @doctorj.in first 👉 then tap  [ I followed ✓ ]"
                             (re-checks, then sends the link)
```

## Important: Instagram's built-in tools can't check follows
Instagram's own auto-replies (in Meta Business Suite) can answer a keyword, but they **cannot check
whether the person follows you.** To get the "are you following?" gate, you need a Meta-approved
automation tool such as **ManyChat**. ManyChat has a "follows your account" condition, and its
keyword automations have a "require follow" option.

---

## Option A (recommended): ManyChat, with a real follow check

**Before you start**
1. **Switch to a professional account:** in Instagram, open Settings → Account type and tools → Switch to professional account. Choose *Creator* or *Business*.
2. **Allow automation tools:** in Instagram, open Settings → Messages and story replies → Message controls → Connected tools, and turn on **Allow access to messages**.
3. **Connect ManyChat:** create a free account at manychat.com, choose **Instagram**, and log in with @doctorj.in.

**Build the automation**
1. **Start the automation:** go to Automation → New automation → *Start from scratch*.
2. **Add triggers:**
   - *Instagram → User sends a message* with keyword **EARLY ACCESS**. Also add the variants `early access`, `Early Access` and `EARLYACCESS`, and set it to "message contains".
   - *(Optional)* *Instagram → User comments on your post or reel* with the same keyword, so people who comment "EARLY ACCESS" on the reel get the DM too.
3. **First message (the question):**
   > Hi! 👋 Quick check before early access: are you following @doctorj.in?
4. **Add a Condition block:** *Instagram → "Is following your account"*. You may see it as "Follows you". It creates two branches:
   - **Yes (following):**
     > Verified ✓ you're following! Here's your early-access link 👇
     >
     > Add a **button**: "Join early access", linking to `https://sketchroot.com`.
     > Optional second line: "Sign up with your Gmail. Profiles are verified, and dental students get priority."
   - **No (not following):**
     > Almost there! Follow @doctorj.in first 👉 then tap below.
     >
     > Add a **button**: "I followed ✓". Point this button back to the **same Condition block**, so it re-checks and then sends the link.
5. **Turn it on:** set the automation **live**, then test it from a second Instagram account. Test both the "not following" and "following" paths.

**Notes**
- **Free plan limits:** the free plan covers basic keyword flows. Some conditions and higher volumes may need ManyChat Pro, so check the current plan limits in your account.
- **Follow-check lag:** follow status can take a few seconds to register. If someone taps "I followed ✓" instantly, the check may say no, and the re-check button handles that.
- **Pin the keyword:** add "DM EARLY ACCESS" to the caption and the pinned comment so the trigger word is easy to copy.
- **Messaging window:** Meta only allows automated replies to someone who messaged or commented first, within 24 hours. A keyword-triggered flow meets that rule.

---

## Option B: free, built into Instagram (no follow check)
This option uses Meta Business Suite on desktop:
1. **Open the automations:** go to business.facebook.com → **Inbox** → **Automations** (top right) → **Custom keywords** → **Create**.
2. **Choose the channel:** select **Instagram**.
3. **Add keywords:** enter `EARLY ACCESS`, `early access` and `Early Access`. Matching is case-sensitive, and you can add up to 5 keywords.
4. **Write the reply:**
   > Thanks for joining! 🎟 Make sure you're following @doctorj.in. Early access is for the first 5,000 followers, and every profile is verified. Join here with your Gmail 👉 sketchroot.com
5. **Save it and turn it on.**

This replies automatically but **can't verify the follow**. You'd check follows by hand during the profile verification step.

---

## Matching the reel exactly
| In the reel | Where it comes from |
|---|---|
| "Hi! 👋 Quick check before early access: are you following @doctorj.in?" | ManyChat first message |
| Buttons "✅ Yes, I follow" / "Not yet" | ManyChat quick replies. Optionally show these before the condition, then run the real check |
| "Verified ✓ you're following! Here's your early-access link 👇" plus a sketchroot.com card | ManyChat "Yes" branch with a link button |
| Gmail notification "You're on the early-access list ✓" | Confirmation email sent by the sketchroot.com form. Make sure the form sends one |

Sources: [ManyChat community: Instagram "following" condition](https://community.manychat.com/general-q-a-43/instagram-condition-following-doesn-t-work-for-more-and-more-followers-10490) · [Inro: keyword automations with a follow requirement](https://www.inro.social/blog/automate-instagram-dm-marketing) · [Meta Business Suite custom keyword setup](https://blog.omnichat.ai/instagram-automation/) · [CreatorFlow: Instagram built-in automation limits](https://creatorflow.so/blog/instagram-built-in-automation/)
