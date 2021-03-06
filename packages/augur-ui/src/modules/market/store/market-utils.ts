import classNames from 'classnames';
import {
  TRADING_TUTORIAL,
  CATEGORICAL,
  TRADING_TUTORIAL_OUTCOMES,
  TRADING_TUTORIAL_STEPS,
  TRADING_TUTORIAL_COPY
} from 'modules/common/constants';
import {
  TUTORIAL_OPEN_ORDER,
  TUTORIAL_FILL,
  TUTORIAL_FILL_TRADE,
  TUTORIAL_POSITION,
} from 'modules/market/store/constants';
import { CREATE_MARKET } from 'modules/routes/constants/views';
import parsePath from 'modules/routes/helpers/parse-path';
import Styles from 'modules/market/components/market-view/market-view.styles.less';
import { convertUnixToFormattedDate } from 'utils/format-date';

const {
  INTRO_MODAL,
  QUANTITY,
  LIMIT_PRICE,
  OPEN_ORDERS,
  MY_FILLS,
  POSITIONS,
  MARKET_DETAILS,
  BUYING_SHARES,
  ORDER_VALUE,
  PLACE_ORDER,
  SELECT_OUTCOME,
  ORDER_BOOK,
} = TRADING_TUTORIAL_STEPS;

export const getIsTutorial = marketId => marketId === TRADING_TUTORIAL;
export const getIsPreview = location =>
  parsePath(location.pathname)[0] === CREATE_MARKET;
export const getTutorialPreview = (marketId, location) => {
  const isTutorial = getIsTutorial(marketId);
  const isPreview = getIsPreview(location);
  return {
    isTutorial,
    isPreview,
    preview: isTutorial || isPreview,
  };
};

export function findType(market) {
  if (market) {
    const { numOutcomes, marketType } = market;

    if (marketType === CATEGORICAL && numOutcomes > 4) {
      return true;
    } else {
      return false;
    }
  } else {
    return true;
  }
}

export const handleStyleCalculation = (
  preview,
  tradingTutorial,
  tutorialStep,
  extendOrderBook,
  extendTradeHistory,
  extendOutcomesList,
  extendOrders,
  cat5
) => ({
  MarketViewStyle: classNames(Styles.MarketView, {
    [Styles.Inactive]: preview,
  }),
  ContainerStyle: classNames(Styles.container, {
    [Styles.Tutorial]: tradingTutorial,
  }),
  HeaderStyle: classNames(Styles.Header, {
    [Styles.HeaderTutorial]: tradingTutorial && tutorialStep === MARKET_DETAILS,
  }),
  TradingFormStyle: classNames(Styles.TradingForm, {
    [Styles.TradingFormTutorial]:
      tradingTutorial &&
      ((tutorialStep >= BUYING_SHARES && tutorialStep <= ORDER_VALUE) ||
        tutorialStep === PLACE_ORDER),
    [Styles.PlaceOrderTutorial]:
      tradingTutorial && tutorialStep === PLACE_ORDER,
    [Styles.SelectOutcomeTutorial]:
      tradingTutorial && tutorialStep === SELECT_OUTCOME,
    [Styles.BuyingSharesTutorial]:
      tradingTutorial && tutorialStep === BUYING_SHARES,
    [Styles.QuantityTutorial]: tradingTutorial && tutorialStep === QUANTITY,
    [Styles.LimitPriceTutorial]:
      tradingTutorial && tutorialStep === LIMIT_PRICE,
    [Styles.OrderValueTutorial]:
      tradingTutorial && tutorialStep === ORDER_VALUE,
  }),
  ChartsPaneStyle: classNames(Styles.ChartsPane, {
    [Styles.Hide]: cat5 ? extendOutcomesList : extendOrders,
  }),
  OrdersPaneStyle: classNames(Styles.OrdersPane, {
    [Styles.OpenOrdersTutorial]:
      tradingTutorial && tutorialStep === OPEN_ORDERS,
    [Styles.FillsTutorial]: tradingTutorial && tutorialStep === MY_FILLS,
    [Styles.PositionsTutorial]: tradingTutorial && tutorialStep === POSITIONS,
  }),
  OrderBookStyle: classNames(Styles.OrderBook, {
    [Styles.hide]: extendTradeHistory,
    [Styles.show]: extendOrderBook,
    [Styles.OrderBookTutorial]: tradingTutorial && tutorialStep === ORDER_BOOK,
  }),
  HistoryStyle: classNames(Styles.History, {
    [Styles.hide]: extendOrderBook,
    [Styles.show]: extendTradeHistory,
  }),
});

export const handleTutorialInfo = (isTutorial, tutorialStep) => {
  const totalSteps = Object.keys(TRADING_TUTORIAL_STEPS).length / 2 - 2;
  if (!isTutorial)
    return {
      tutorialCopy: '',
      isIntro: false,
      isDetails: false,
      isQuantity: false,
      isPrice: false,
      isOpenOrders: false,
      isFills: false,
      isPositions: false,
      isPlaceOrder: false,
      isOrderBook: false,
      isTrading: false,
      totalSteps,
    };
  return {
    tutorialCopy: TRADING_TUTORIAL_COPY[tutorialStep],
    isIntro: tutorialStep === INTRO_MODAL,
    isDetails: tutorialStep === MARKET_DETAILS,
    isQuantity: tutorialStep === QUANTITY,
    isPrice: tutorialStep === LIMIT_PRICE,
    isOpenOrders: tutorialStep === OPEN_ORDERS,
    isFills: tutorialStep === MY_FILLS,
    isPositions: tutorialStep === POSITIONS,
    isPlaceOrder: tutorialStep === PLACE_ORDER,
    isOrderBook: tutorialStep === ORDER_BOOK,
    isTrading:
      (tutorialStep >= BUYING_SHARES && tutorialStep <= ORDER_VALUE) ||
      tutorialStep === PLACE_ORDER,
    totalSteps,
  };
};

export const handleTutorialMocks = (
  selectedOutcomeId,
  marketDescription = '',
  marketId,
  currentAugurTimestamp,
  isOpenOrders,
  isFills,
  isPositions
) => {
  const timestamp = convertUnixToFormattedDate(currentAugurTimestamp);
  const description = TRADING_TUTORIAL_OUTCOMES[selectedOutcomeId]?.description;
  const orders = isOpenOrders
    ? [
        {
          ...TUTORIAL_OPEN_ORDER,
          outcomeName: description,
        },
      ]
    : null;
  const fills = isFills
    ? [
        {
          ...TUTORIAL_FILL,
          marketDescription,
          marketId,
          outcome: description,
          timestamp,
          trades: [
            {
              ...TUTORIAL_FILL_TRADE,
              marketDescription,
              marketId,
              outcome: description,
              timestamp,
            },
          ],
        },
      ]
    : null;
  const positions = isPositions
    ? [
        {
          ...TUTORIAL_POSITION,
          outcomeName: description,
          outcomeId: selectedOutcomeId,
        },
      ]
    : null;
  const selected = isFills ? 1 : isPositions ? 2 : 0;
  return {
    selected,
    orders,
    fills,
    positions,
  };
};
