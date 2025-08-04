export enum ChannelType {
  PUBLIC = 'public',
  PRIVATE = 'private',
  DIRECT = 'direct'
}

export const CHANNEL_TYPE_LABELS: Record<ChannelType, string> = {
  [ChannelType.PUBLIC]: '공개',
  [ChannelType.PRIVATE]: '비공개',
  [ChannelType.DIRECT]: '개인'
}; 