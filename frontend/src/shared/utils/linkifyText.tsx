const urlRegex = /(https?:\/\/[^\s]+)/g;

function linkifyText(text: string): (string | React.ReactNode)[] {
    return text.split(urlRegex).map((part, i) => {
        if (urlRegex.test(part)) {
            return (
                <a
                    key={i}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline break-all"
                >
                    {part}
                </a>
            )
        }
        return part
    })
}

export default linkifyText