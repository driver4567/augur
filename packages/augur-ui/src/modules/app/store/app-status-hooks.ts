import { useReducer } from 'react';
import { APP_STATUS_ACTIONS, DEFAULT_APP_STATUS, THEME, ODDS, IS_HELP_MENU_OPEN, IS_CONNECTION_TRAY_OPEN, IS_ODDS_MENU_OPEN } from 'modules/app/store/constants';

const {
  SET_THEME,
  SET_ODDS,
  SET_IS_ODDS_MENU_OPEN,
  SET_IS_HELP_MENU_OPEN,
  SET_IS_CONNECTION_TRAY_OPEN,
} = APP_STATUS_ACTIONS;

const setHTMLTheme = (theme) => document.documentElement.setAttribute(THEME, theme);

export function AppStatusReducer(state, action) {
  const updatedState = { ...state };
  switch (action.type) {
    case (SET_THEME): {
      updatedState[THEME] = action.theme;
      return updatedState;
    }
    case (SET_ODDS): {
      updatedState[ODDS] = action.odds;
      return updatedState;
    }
    case (SET_IS_ODDS_MENU_OPEN): {
      updatedState[IS_ODDS_MENU_OPEN] = action.isOpen;
      updatedState[IS_HELP_MENU_OPEN] = false;
      updatedState[IS_CONNECTION_TRAY_OPEN] = false;
      return updatedState;
    }
    case (SET_IS_HELP_MENU_OPEN): {
      updatedState[IS_ODDS_MENU_OPEN] = false;
      updatedState[IS_HELP_MENU_OPEN] = action.isOpen;
      updatedState[IS_CONNECTION_TRAY_OPEN] = false;
      return updatedState;
    }
    case (SET_IS_CONNECTION_TRAY_OPEN): {
      updatedState[IS_ODDS_MENU_OPEN] = false;
      updatedState[IS_HELP_MENU_OPEN] = false;
      updatedState[IS_CONNECTION_TRAY_OPEN] = action.isOpen;
      return updatedState;
    }
    default:
      throw new Error(`Error: ${action.type} not caught by App Status reducer.`);
  }
};

export const useAppStatus = (defaultState = DEFAULT_APP_STATUS) => {
  const [state, dispatch] = useReducer(AppStatusReducer, defaultState);
  setHTMLTheme(state.theme);
  return {
    ...state,
    actions: {
      setTheme: theme => { 
        setHTMLTheme(theme);
        dispatch({ type: SET_THEME, theme });
      },
      setOdds: odds => dispatch({ type: SET_ODDS, odds }),
      setIsOddsMenuOpen: isOpen => dispatch({ type: SET_IS_ODDS_MENU_OPEN, isOpen }),
      setIsHelpMenuOpen: isOpen => dispatch({ type: SET_IS_HELP_MENU_OPEN, isOpen }),
      setIsConnectionTrayOpen: isOpen => dispatch({ type: SET_IS_CONNECTION_TRAY_OPEN, isOpen }),
    }
  }
}