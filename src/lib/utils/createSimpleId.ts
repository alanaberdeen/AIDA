// Generates a unique Id.
// Adapted from Firestore's document Id generator.
// See: https://github.com/firebase/firebase-js-sdk/blob/73a586c92afe3f39a844b2be86086fddb6877bb7/packages/firestore/src/util/misc.ts#L36
const createSimpleId = (size = 20, lowerCaseOnly = false) => {
	let autoId = ''

	// Alphanumeric characters
	const chars = lowerCaseOnly
		? 'abcdefghijklmnopqrstuvwxyz0123456789'
		: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

	for (let i = 0; i < size; i += 1) {
		autoId += chars.charAt(Math.floor(Math.random() * chars.length))
	}
	return autoId
}

export default createSimpleId
