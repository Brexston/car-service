export function toInputDate(date: Date = new Date()): string {
	return date.toISOString().split('T')[0]!;
}

export function formatDate(dateStr: string): string {
	return new Date(dateStr).toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});
}
