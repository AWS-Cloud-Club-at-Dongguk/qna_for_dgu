import GithubIcon from '@/assets/icons/github_icon.svg?react'
import MailIcon from '@/assets/icons/email.svg?react'

function Footer() {
    return (
        <footer className="w-full bg-white text-sm text-muted">
            <div className="flex px-2 py-6 justify-end items-center gap-2">
                <a href="mailto:bian87@dgu.ac.kr" className="hover:opacity-80">
                    <div className="bg-svg-gray p-1 rounded-full flex items-center justify-center">
                        <MailIcon width={20} height={20} />
                    </div>
                </a>
                <a
                    href="https://github.com/AWS-Cloud-Club-at-Dongguk/qna_for_dgu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80"
                >
                    <GithubIcon fill="gray" width={34} height={34} />
                </a>
            </div>
        </footer>
    )
}

export default Footer
