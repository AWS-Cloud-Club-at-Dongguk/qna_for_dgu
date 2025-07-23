function formatTime(
    date: string | Date,
    locale: string = 'en-US', // ko : 'ko-KR'
    hourFormat: '2-digit' | 'numeric' = '2-digit',
    minuteFormat: '2-digit' | 'numeric' = '2-digit'
): string {
    const d = typeof date === 'string' ? new Date(date) : date

    return d.toLocaleTimeString(locale, {
        hour: hourFormat,
        minute: minuteFormat,
    })
}

export default formatTime
