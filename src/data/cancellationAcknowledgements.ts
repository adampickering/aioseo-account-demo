/**
 * Reason-specific acknowledgement lines for Step 5 (cancellation confirmation).
 * Keyed by the reason variant letter.
 */
export const cancellationAcknowledgements: Record<string, string> = {
	A: 'We hear you\u2014price matters. If your budget changes, your comeback code below is waiting.',
	B: 'We\u2019ve noted your feedback on auto-renewals. We\u2019re working on giving customers more billing control.',
	C: 'We\u2019re sorry we couldn\u2019t resolve this. Your feedback has been flagged with our engineering team.',
	D: 'We respect your decision. If your new solution doesn\u2019t work out, we\u2019ll be here.',
	E: 'Your feedback has been shared with our product team. It helps us decide what to build next.',
	F: 'Sorry to hear about your site. If you launch something new, your comeback code works on any plan.',
	G: 'Totally understandable. If you decide to give SEO another shot, we\u2019ll make setup easy.',
	H: 'Thanks for sharing your feedback. It helps us build a better product.',
}
