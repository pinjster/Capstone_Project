

export type CurrentUser = {
    logged: boolean,
    username: string,
    accessToken: string,
}

export type MediaType = {
    title: string,
    year: string,
    mediaID: number,
    type: string,
    description: string,
    author: string,
    img: string,
    genre: string[],
}

export type RmendType = {
    rmend_id: number,
    media: MediaType,
    username: string,
    body: string,
    userRating: number,
    dateAdded: string,
    rmendForTitle: string,
    rmendForType: string,
    rmendForMediaId: number,
    totalLikes: number,
}

export type UserType = {
    username: string,
    email: string,
    followerCount: number,
    followers: string[],
    following: string[],
    followingCount: number,
    joined: string,
    rmends: RmendType[]
}