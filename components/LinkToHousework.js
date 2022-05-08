
import Link from "next/link"
export default function LinkToHousework() {
  return (
    <Link href="/housework-page">
      <div className="flex cursor-pointer mt-3">
        {/* <<アイコン */}
        <svg className="w-6 h-6 mr-2"
          fill="none" stroke="currentColor"
          viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>

        <span>一覧へ戻る</span>
      </div>
    </Link>

  )
}
