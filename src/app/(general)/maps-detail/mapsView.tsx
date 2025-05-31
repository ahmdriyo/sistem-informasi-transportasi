'use client'
import MapsViwe from '@/components/maps/MapsViwe'
import { ArrowRightIcon } from '@/icons'
import { useRouter } from 'next/navigation'
const MapsView = () => {
  const router = useRouter()
  return (
    <div>
      <div
        className="flex flex-row justify-start text-center items-center gap-2 mb-4 cursor-pointer"
        onClick={() => router.back()}
      >
        <div className="text-black dark:text-white rotate-180">
          <ArrowRightIcon />
        </div>
        <p className="text-warning-25">Kembali</p>
      </div>
      <div className="relative h-[80vh] w-full">
        <MapsViwe />
      </div>
    </div>
  )
}

export default MapsView
