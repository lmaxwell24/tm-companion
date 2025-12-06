declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_CLIENT_ID: string;
      API_CLIENT_SECRET: string;
      API_EXPIRATION_DATE: string;
      API_CLIENT_API_KEY: string;
      TM_HOST_ADDR: string;
      COMPANION_ADDR: string;
      COMPANION_MATCH_START_LOC: string;
      COMPANION_MATCH_END_LOC: string;
      COMPANION_IN_MATCH_LOC: string;
      COMPANION_FIELD_ACTIVATION_LOC: string;
      COMPANION_FIELD_1_LOC: string;
      COMPANION_FIELD_2_LOC: string;
      COMPANION_FIELD_3_LOC: string;
      COMPANION_RED_WIN: string;
      COMPANION_BLUE_WIN: string;
      COMPANION_TIE_WIN: string;
      TM_PY_ENABLE: string;
      TM_PY_ADDR: string;
    }
  }
}

export {}
