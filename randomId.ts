export const randomId = () => {
	return Math.floor(Math.random() * 1000).toString().padStart(4, '0')
}