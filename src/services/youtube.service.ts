const request = require('request')
const {EventEmitter} = require('events');

class YoutubeServie extends EventEmitter {
  constructor(videoId: string, apiKey: string) {
    super()
    this.liveId = videoId
    this.key = apiKey
    this.getChatId()
  }

  getChatId() {
    if (!this.liveId) return this.emit('error', 'Invalid video URL')
    const url = 'https://www.googleapis.com/youtube/v3/videos'+
      '?part=liveStreamingDetails'+
      `&id=${this.liveId}`+
      `&key=${this.key}`
    this.request(url, (data: any) => {
      if (!data.items.length)
        this.emit('error', 'Can not find chat.')
      else {
        this.chatId = data.items[0].liveStreamingDetails.activeLiveChatId
        this.emit('ready')
      }
    })
  }
  
  getChat() {
    if (!this.chatId) return this.emit('error', 'Chat id is invalid.')
    const url = 'https://www.googleapis.com/youtube/v3/liveChat/messages'+
      `?liveChatId=${this.chatId}`+
      '&part=id,snippet,authorDetails'+
      '&maxResults=2000'+
      `&key=${this.key}`
    this.request(url, (data: any) => {
      this.emit('json', data)
    })
  }

  request(url: string, callback: Function) {
    request({
      url: url,
      method: 'GET',
      json: true,
    }, (error : Object, response: any, data: Object) => {
      if (error)
        this.emit('error', error)
      else if (response.statusCode !== 200)
        this.emit('error', data)
      else
        callback(data)
    })
  }
  
  listen(delay: number) {
    let lastRead = 0, time = 0
    this.interval = setInterval(() => this.getChat(), delay)
    this.on('json', (data: any) => {
      for (const item of data.items) {
        time = new Date(item.snippet.publishedAt).getTime()
        if (lastRead < time) {
          lastRead = time;
          this.emit('message', item);
        }
      }
    })
  }
  
  stop() {
    clearInterval(this.interval)
  }
}

export default YoutubeServie;