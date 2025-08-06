import { useEffect, useState } from "react";
import { usePlayingState } from "../../../../hooks/useIsPlaying";
import { usePathname } from "next/navigation";
import { Media } from '@/services/common/types';
import Loading from "@/app/_components/shared/Loading";
import Link from "next/link";
import Image from "next/image";

export default function SideVideo() {

    const isPlaying = usePlayingState((state) => state.isPlaying)
    const [media, setMedia] = useState<Media[]>([])
    const pathname = usePathname();
    const platform:string = pathname.split('/')[2]

    useEffect(() => {
        const fetchData = async (platform: string) => {
            try {
                // Change the api to the api that gives proper recommendations
                // Currently fetching all reddit by taking pathname and splitting it 
                const res = await fetch(`/api/videos/media/${platform}`);
                if (!res.ok) {
                    throw new Error(`Error: ${res.statusText}`);
                }
                const data = await res.json();
                setMedia(data.body);
            } catch (error: any) {
                throw new Error('Error fetching media:', error);
            }
        }
        fetchData(platform)
    }, [platform])

    const viewTime = (durationMs:number):string => {
        const duration = durationMs / 1000;
        const hours = Math.floor(duration / 3600); 
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = Math.floor(duration % 60);

    if(hours < 1){
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;    
    }
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    const getIdOfplatform = (media: Media):number => {
            if(!media || media === undefined || media === null){
                throw new Error('Media is empty or not an acceptable value')
            }
            if(media.youtubeId === undefined){
                throw new Error('YoutubeId is null or not an acceptable value')
            }
            if(media.redditId === undefined){
                throw new Error('redditId is null or not an acceptable value')
            }
            const platform = media.platform.toLowerCase().trim();
            if(!platform || platform === null){
                throw new Error('Platform is null or empty')
            }
            let platformId:number = 0;
            if(platform === 'youtube' && media.youtubeId){
                console.log(platform)
                platformId = media.youtubeId;
            }
            else if(platform === 'reddit' && media.redditId){
                console.log(platform)
                platformId = media.redditId;
            }
    
            if(platformId === 0){
                throw Error('Not assigned any id see the issue properly!!');
            }
            return platformId;
    }

    return (
        <div className={`overflow-y-auto border-t-1 border-t-golden w-[90%] mt-2 border-l-1 pl-1 border-l-golden flex flex-col rounded-large relative z-5
            ${isPlaying ? 'blur-[1px] bg-blend-darken brightness-50 transition-all duration-500' : ''}
        `}>
            <p className="w-full flex items-center justify-center font-mono pt-2 text-gray-400 text-center font-semibold">Suggested Videos</p>
            <div className="flex-1 w-full overflow-y-auto scrollbar-hide scrollbar-thumb-golden scrollbar-track-transparent px-2">
                {
                    media.length <= 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <Loading />
                        </div>
                    ) : (
                        <div className="py-3 space-y-4">
                            {media.map((video: Media) => (
                                <div key={video.id} className="flex w-full h-28 cursor-pointer hover:shadow-md transition-shadow hover:bg-[#202022] rounded-xl hover:border-golden" id="eachVideo">
                                    <Link
                                        href={`/video/${platform}/${getIdOfplatform(video)}/${video.id}`}
                                        className="flex w-full h-full"
                                    >
                                        <div className="w-[48%] h-full relative" id="ImageOfVideo">
                                            <Image
                                                src={video.thumbnailUrl!}
                                                alt={video.title || "Video thumbnail"}
                                                fill
                                                className="object-cover rounded-l-medium"
                                            />
                                        </div>
                                        <div className="w-1/2 h-full p-2 rounded-r-medium flex flex-col gap-1" id="descriptionOfVideo">
                                            <h3 className="text-sm text-white font-medium line-clamp-2">{video.title}</h3>
                                            <h3 className="text-sm text-gray-400 font-medium line-clamp-2">{video.category} | {video.type}</h3>
                                            <h3 className="text-sm text-white font-medium line-clamp-2 pt-4">{viewTime(video.durationMs)}</h3>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )
                }
            </div>
        </div>
    )
}