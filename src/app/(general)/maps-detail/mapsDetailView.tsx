'use client'
import { ArrowRightIcon } from '@/icons'
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation'
export default function MapsDetailView() {
  const router = useRouter()
  const MapsView = dynamic(() => import('@/components/maps/MapsView'), { ssr: false });
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
        <MapsView />
      </div>
    </div>
  )
}
