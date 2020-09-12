import { Entity } from './entity'
import { Media } from './medias'
import { Scala } from './Scala'

export interface PlaylistInsert {
    name: string;
    description?: string;
    enableSmartPlaylist: boolean;
    playlistType: PlaylistType;
    healthy: boolean;
}

interface PlaylistOptionDTO {
    key: string;
    value: string;
}


export interface PlaylistItem {
    id: number;
    playlistItemType: 'MEDIA_ITEM' | 'MESSAGE' | 'SUB_PLAYLIST ';
    sortOrder: number;
    media?: Media;
    duration: number;
    durationHoursSeconds: string;
    useValidRange: boolean;
    startValidDate: string; // yyyy-MM-dd
    endValidDate: string; // yyyy-MM-dd
    reservationId: string;
    subPlaylistPickPolicy: number;
    playFullscreen: boolean;
    audioDucking: boolean;
    auditItem: boolean;
    timeSchedules: string;
    meetAllConditions: boolean;
    options: PlaylistOptionDTO[],
    disabled: boolean;
}

export interface Playlist extends PlaylistInsert {
    id: number;
    controlledByAdManager?: boolean;
    pickPolicy?: string;
    shuffleNoRepeatType?: string;
    shuffleNoRepeatWithin?: number;
    lastModified?: string; // yyyy-MM-dd HH:mm:ss
    thumbnailDownloadPaths?: string;
    workgroups?: string;
    createdDate?: string;
    createdBy?: string;
    modifiedByName?: string;
    playlistItems?: PlaylistItem[];
    htmlDuration?: number;
    extSourceDuration?: number;
    minDuration?: number;
    maxDuration?: number;
    channelsCount?: number;
    asSubPlaylistsCount?: number;
    messagesCount?: number;
    itemCount: number;
    transitionDuration?: number;
    imageDuration?: number;
    readOnly?: boolean;
    durationCalculationCompleted?: boolean;
    addMedia: (mediaList: number[]) => Promise<Playlist>;
}

export interface PlaylistUsage {
    timeSlotCount: number;
    timeTriggerCount: number;
    eventTriggerCount: number;
    nonScheduleContentCount: number;
    subPlaylistCount: number;
    messageCount: number;
}

export enum PlaylistType {
    ALTERNATE_PLAYLIST = 'ALTERNATE_PLAYLIST',
    AUDIO_PLAYLIST = 'AUDIO_PLAYLIST',
    DATA_PLAYLIST = 'DATA_PLAYLIST',
    MEDIA_PLAYLIST = 'MEDIA_PLAYLIST',
    SMART_AUDIO_PLAYLIST = 'SMART_AUDIO_PLAYLIST',
    SMART_DATA_PLAYLIST = 'SMART_DATA_PLAYLIST',
    SMART_MEDIA_PLAYLIST = 'SMART_MEDIA_PLAYLIST',
}

export class Playlists extends Entity<Playlist, PlaylistUsage, PlaylistInsert> {
    constructor(server: Scala) {
        super(server, 'playlists')
    }

    // mount(scalaComp: Playlist): Playlist {
    //     const newP: Playlist = scalaComp
    //     newP.addMedia = async (mediaList: number[]) => {
    //         const localUrl = `${this.endpoint}/${scalaComp.id}/playlistItems/${mediaList}`
    //         const resp = await this.server.api.put<ScalaErrorResponse & ScalaUpdateResponse>(localUrl, {
    //             media: { duration: 120 },
    //         })
    //         if (resp.status !== 200) {
    //             if (resp.data.description) {
    //                 throw new Error(resp.data.description)
    //             } else {
    //                 throw new Error(resp.statusText)
    //             }
    //         }
    //         if (resp.data.value) {
    //             if (resp.data.value.toUpperCase() === 'DONE') {
    //                 return this.get(scalaComp.id)
    //             }
    //         }
    //         throw new Error('Unexpected error')
    //     }
    //     return newP
    // }
}
