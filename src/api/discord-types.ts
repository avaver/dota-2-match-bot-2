export class Message {
  constructor(public embeds: Embed[]) {}
}

export class Embed {
  constructor(public title: string, 
    public description: string, 
    public color?: number,
    public url?: string,
    public thumbnail?: Thumbnail,
    public author?: Author
  ) {}
}

export class Thumbnail {
  constructor(public url: string) {}
}

export class Author {
  constructor(public name: string) {}
}