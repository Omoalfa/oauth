import { EUserPosition } from "./company_user.entity"

export enum EScopes {
  SUDO = 'SUDO',
  READ_NEWS_ARTICLE = 'READ_NEWS_ARTICLE',
  CREATE_NEWS_ARTICLE = 'CREATE_NEWS_ARTICLE',
  DELETE_NEWS_ARTICLE = 'DELETE_NEWS_ARTICLE',
  EDIT_NEWS_ARTICLE = 'EDIT_NEWS_ARTICLE',
  READ_NEWSPAPER_CONTENT = 'READ_NEWSPAPER_CONTENT',
  CREATE_NEWSPAPER_CONTENT = 'CREATE_NEWSPAPER_CONTENT',
  DELETE_NEWSPAPER_CONTENT = 'DELETE_NEWSPAPER_CONTENT',
  EDIT_NEWSPAPER_CONTENT = 'EDIT_NEWSPAPER_CONTENT',
  READ_AD_SLOTS = 'READ_AD_SLOTS',
  CREATE_AD_SLOTS = 'CREATE_AD_SLOTS',
  DELETE_AD_SLOTS = 'DELETE_AD_SLOTS',
  EDIT_AD_SLOTS = 'EDIT_AD_SLOTS',
  READ_CAMPAIGN = 'READ_CAMPAIGN',
  EDIT_CAMPAIGN = 'EDIT_CAMPAIGN',
  CREATE_CAMPAIGN = 'CREATE_CAMPAIGN',
  DELETE_CAMPAIGN = 'DELETE_CAMPAIGN',
  READ_AD_CREATIVES = 'READ_AD_CREATIVES',
  EDIT_AD_CREATIVES = 'EDIT_AD_CREATIVES',
  CREATE_AD_CREATIVES = 'CREATE_AD_CREATIVES',
  DELETE_AD_CREATIVES = 'DELETE_AD_CREATIVES',

  READ_PAYMENT = 'READ_PAYMENT',
}

export const editorScopes: EScopes[] = [
  EScopes.CREATE_NEWSPAPER_CONTENT,
  EScopes.EDIT_NEWSPAPER_CONTENT,
  EScopes.READ_NEWSPAPER_CONTENT,
  EScopes.DELETE_NEWSPAPER_CONTENT,
  EScopes.EDIT_NEWS_ARTICLE,
  EScopes.READ_NEWS_ARTICLE,
  EScopes.READ_AD_CREATIVES
]
export const advertisingScopes: EScopes[] = [
  EScopes.READ_AD_SLOTS,
  EScopes.CREATE_CAMPAIGN,
  EScopes.EDIT_CAMPAIGN,
  EScopes.DELETE_CAMPAIGN,
  EScopes.READ_CAMPAIGN
]

export const designScopes: EScopes[] = [
  EScopes.EDIT_AD_CREATIVES,
  EScopes.CREATE_AD_CREATIVES,
  EScopes.EDIT_AD_CREATIVES,
  EScopes.DELETE_AD_CREATIVES,
]

export const financeScopes: EScopes[] = [
  EScopes.READ_PAYMENT,
]

export const adminScopes: EScopes[] = [
  EScopes.SUDO
]

export const getUserScopes = (position: EUserPosition): EScopes[] => {
  switch (position) {
    case EUserPosition.ADMIN:
      return adminScopes;
    case EUserPosition.ADVERTS:
      return advertisingScopes;
    case EUserPosition.DESIGNER:
      return designScopes;
    case EUserPosition.EDITOR:
      return editorScopes;
    case EUserPosition.FINANCE:
      return financeScopes;
  }
}
