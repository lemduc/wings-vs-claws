# Identity proofing & eKYC

> Before a system can authenticate you, someone has to decide the account is really yours. Identity proofing is that first, hardest step — and the one attackers now target with synthetic media.

## Proofing is not authentication

Authentication checks a credential you already hold. Identity proofing (enrollment) is what happens before that credential exists: binding a real-world person to a new account. Get it wrong and every later control is perfectly enforcing access for the wrong human. NIST SP 800-63A separates this as its own assurance dimension — IAL1 (self-asserted), IAL2 (evidence checked remotely or in person), IAL3 (in-person, verified by a trained operator).

## What eKYC actually checks

Remote proofing ("eKYC" in finance and telecom) usually chains three checks: the document is genuine, the document belongs to a real person, and the person presenting it is alive and present. Modern ID documents carry a signed chip — passive authentication under ICAO Doc 9303 verifies the issuer’s signature over the data groups, which is far stronger than reading printed text with OCR.

## Presentation vs injection attacks

Liveness detection under ISO/IEC 30107-3 is built to catch presentation attacks — a printed photo, a screen replay, a silicone mask held up to the camera. Injection attacks skip the camera entirely and feed a synthetic video stream straight into the app or driver. Generative face-swapping made these cheap, and a PAD score alone does not see them: the frames look perfectly live because, as far as the sensor pipeline knows, they are.

## Defending the capture path

Because the weak point is the path rather than the picture, the controls are path controls: attest the app and device, verify the frames came from a real sensor, bind the session to a signed challenge the attacker cannot pre-render, check the chip rather than the printed face, and keep a human review lane for the cases the score cannot settle.

## How it changes for AI agents

Agents inherit whatever the proofing step got right or wrong — an agent acting on behalf of a fraudulently enrolled account is a perfectly authorized path to someone else’s money. The reverse problem is newer: agents are also the ones submitting selfies and documents now, so "is a human present?" stops being a safe proxy for "is this the right human?". Expect proofing evidence to travel with the delegation chain, so a resource can ask how strongly the underlying human was ever verified.

## Quick check

1. Identity proofing happens…
   - Answer: Once, when the account is created — Proofing binds a real person to an account at enrollment; authentication then checks the credential that enrollment issued.
2. An attacker feeds a generated video straight into the app, bypassing the camera. This is…
   - Answer: An injection attack — Presentation attacks are shown to the sensor; injection attacks replace the sensor feed. Liveness scoring is aimed at the former.
3. Reading an ID document’s signed chip is stronger than OCR of the printed page because…
   - Answer: The issuer’s signature can be verified — ICAO 9303 passive authentication verifies the issuing authority’s signature over the data — printed text can simply be forged.

---
Source: https://iam.vjsonline.org/learn/identity-proofing · Part of Wings vs Claws — Learn IAM — from directories to agents. An interactive, source-grounded guide to identity & access management for the AI-agent era.
