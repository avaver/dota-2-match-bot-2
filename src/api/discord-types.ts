export class Message {
  constructor(public embeds: Embed[], public content?: string, public username?: string) {}
}

export class Embed {
  constructor(public title: string, 
    public description: string, 
    public color?: number,
    public url?: string,
    public thumbnail?: Thumbnail,
    public author?: Author,
    public timestamp?: string,
    public fields?: Field[],
    public footer?: Footer
  ) {}
}

export class Thumbnail {
  constructor(public url: string) {}
}

export class Author {
  constructor(public name: string,
    public url?: string,
    public icon_url?: string
  ) {}
}

export class Field {
  constructor(public name: string, public value: string, public inline: boolean = false) {}
}

export class Footer {
  constructor(public text: string, public icon_url?: string) {}
}