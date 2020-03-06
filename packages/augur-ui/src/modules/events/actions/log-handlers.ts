import { Getters, SubscriptionEventName } from '@augurproject/sdk';
import { updateAlert } from 'modules/alerts/actions/alerts';
import {
  loadAllAccountPositions,
  loadAccountOnChainFrozenFundsTotals,
  checkUpdateUserPositions,
} from 'modules/positions/actions/load-account-positions';
import {
  removeMarket,
  updateMarketsData,
} from 'modules/markets/actions/update-markets-data';
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info';
import {
  loadMarketTradingHistory,
} from 'modules/markets/actions/market-trading-history-management';
import { updateAssets } from 'modules/auth/actions/update-assets';
import { loadAccountOpenOrders } from 'modules/orders/actions/load-account-open-orders';
import { MarketInfos } from 'modules/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'store';
import { updateBlockchain } from 'modules/app/actions/update-blockchain';
import { isSameAddress } from 'utils/isSameAddress';
import { Events, Logs, TXEventName, OrderEventType } from '@augurproject/sdk';
import {
  addUpdateTransaction,
  getRelayerDownErrorMessage,
} from 'modules/events/actions/add-update-transaction';
import { augurSdk } from 'services/augursdk';
import { updateConnectionStatus } from 'modules/app/actions/update-connection';
import { checkAccountAllowance } from 'modules/auth/actions/approve-account';
import {
  CANCELORDER,
  CLAIMTRADINGPROCEEDS,
  CONTRIBUTE,
  CREATEMARKET,
  DOINITIALREPORT,
  PUBLICFILLORDER,
  PUBLICTRADE,
  MODAL_ERROR,
  REDEEMSTAKE,
  CREATE_MARKET,
  MODAL_GAS_PRICE,
  SUBMIT_REPORT,
  MIGRATE_FROM_LEG_REP_TOKEN,
  MIGRATE_V1_V2,
  BUY_PARTICIPATION_TOKENS,
  SUBMIT_DISPUTE,
} from 'modules/common/constants';
import { loadAccountReportingHistory } from 'modules/auth/actions/load-account-reporting';
import { loadDisputeWindow } from 'modules/auth/actions/load-dispute-window';
import {
  isOnDisputingPage,
  isOnReportingPage,
  isOnTradePage,
} from 'modules/trades/helpers/is-on-page';
import {
  reloadDisputingPage,
  reloadReportingPage,
} from 'modules/reporting/actions/update-reporting-list';
import { loadUniverseForkingInfo } from 'modules/universe/actions/load-forking-info';
import { loadUniverseDetails } from 'modules/universe/actions/load-universe-details';
import { getCategoryStats } from 'modules/create-market/actions/get-category-stats';
import {
  WALLET_STATUS,
  updateAppStatus,
} from 'modules/app/actions/update-app-status';
import { loadAnalytics } from 'modules/app/actions/analytics-management';
import { marketCreationCreated, orderFilled } from 'services/analytics/helpers';
import { updateModal } from 'modules/modal/actions/update-modal';
import * as _ from 'lodash';
import { loadMarketOrderBook } from 'modules/orders/actions/load-market-orderbook';
import { isCurrentMarket } from 'modules/trades/helpers/is-current-market';
import { removePendingDataByHash, addPendingData, removePendingData } from 'modules/pending-queue/actions/pending-queue-management';
import { removePendingOrder, constructPendingOrderid } from 'modules/orders/actions/pending-orders-management';
import { loadAccountData } from 'modules/auth/actions/load-account-data';
import { wrapLogHandler } from './wrap-log-handler';
import { WalletState } from 'contract-dependencies-gsn';

const handleAlert = (
  log: any,
  name: string,
  toast: boolean,
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { blockchain } = getState();
  try {
    dispatch(
      updateAlert(log.transactionHash, {
        params: log,
        toast: toast,
        status: TXEventName.Success,
        timestamp: blockchain.currentAugurTimestamp * 1000,
        name,
      })
    );
  } catch (e) {
    console.error('alert could not be created', e);
  }
};
const HIGH_PRI_REFRESH_MS = 1000;
const MED_PRI_LOAD_REFRESH_MS = 2000;
const loadOrderBook = _.throttle((dispatch, marketId) => dispatch(loadMarketOrderBook(marketId)), HIGH_PRI_REFRESH_MS, { leading: true });
const loadUserOpenOrders = _.throttle(dispatch => dispatch(loadAccountOpenOrders()), MED_PRI_LOAD_REFRESH_MS, { leading: true });
const throttleLoadMarketOrders = (marketId) => dispatch => loadOrderBook(dispatch, marketId);
const throttleLoadUserOpenOrders = () => dispatch => loadUserOpenOrders(dispatch);

const updateMarketOrderBook = (marketId: string) => (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  if (isCurrentMarket(marketId)) {
    dispatch(throttleLoadMarketOrders(marketId));
  }
}

export const handleTxAwaitingSigning = (txStatus: Events.TXStatus) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('AwaitingSigning Transaction', txStatus.transaction.name);
  dispatch(addUpdateTransaction(txStatus));
};

export const handleTxPending = (txStatus: Events.TXStatus) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('TxPending Transaction', txStatus.transaction.name);
  dispatch(addUpdateTransaction(txStatus));
};

export const handleTxSuccess = (txStatus: Events.TXStatus) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('TxSuccess Transaction', txStatus.transaction.name);
  dispatch(addUpdateTransaction(txStatus));
};

export const handleTxFailure = (txStatus: Events.TXStatus) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('TxFailure Transaction', txStatus.transaction.name);
  dispatch(addUpdateTransaction(txStatus));
};

export const handleTxRelayerDown = (txStatus: Events.TXStatus) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('TxRelayerDown Transaction', txStatus.transaction.name);
  dispatch(addUpdateTransaction(txStatus));
};

export const handleTxFeeTooLow = (txStatus: Events.TXStatus) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('TxFeeTooLow Transaction', txStatus.transaction.name);
  dispatch(addUpdateTransaction(txStatus));
  dispatch(updateModal({ type: MODAL_GAS_PRICE, feeTooLow: true }));
};

export const handleWalletStateUpdate = (response) => async(
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('handleWalletStateUpdate', response);
  const status = response.status;
  if (response && status) {
    dispatch(updateAppStatus(WALLET_STATUS, status));

    if (status === WalletState.Error) {
      const loginAccount = getState().loginAccount;
      const hasEth = (await loginAccount.meta.signer.provider.getBalance(loginAccount.meta.signer._address)).gt(0);

      dispatch(updateModal({
        type: MODAL_ERROR,
        error: getRelayerDownErrorMessage(loginAccount.meta.accountType, hasEth),
        showDiscordLink: false,
        showAddFundsHelp: !hasEth,
        walletType: loginAccount.meta.accountType,
        title: 'We\'re having trouble processing transactions',
      }));
    }
  }
};

export const handleSDKReadyEvent = () => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  // wire up events for sdk
  augurSdk.subscribe(dispatch);

  // app is connected when subscribed to sdk
  dispatch(updateConnectionStatus(true));
  dispatch(loadAccountData());
  dispatch(loadUniverseForkingInfo());
  dispatch(getCategoryStats());
};

export const handleNewBlockLog = (log: Events.NewBlock) => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { blockchain } = getState();
  dispatch(
    updateBlockchain({
      currentBlockNumber: log.highestAvailableBlockNumber,
      blocksBehindCurrent: log.blocksBehindCurrent,
      lastSyncedBlockNumber: log.lastSyncedBlockNumber,
      percentSynced: log.percentSynced,
      currentAugurTimestamp: log.timestamp,
    })
  );
  // update assets each block
  if (getState().authStatus.isLogged) {
    dispatch(updateAssets());
    dispatch(checkAccountAllowance());
    dispatch(
      loadAnalytics(getState().analytics, blockchain.currentAugurTimestamp)
    );
  }
  if (log.logs && log.logs.length > 0){
    console.log(log.logs);
    const eventLogs = log.logs.reduce(
      (p, l) => ({ ...p, [l.name]: p[l.name] ? [...p[l.name], l] : [l] }),
      {}
    );
    Object.keys(eventLogs).map(event => {
      if (EventHandlers[event])
        dispatch(EventHandlers[event](eventLogs[event]));
    })
  }
};

export const handleMarketsUpdatedLog = ({
  marketsInfo = [],
}: {
  marketsInfo: Getters.Markets.MarketInfo[] | Getters.Markets.MarketInfo;
}) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  let marketsDataById = {};
  if (Array.isArray(marketsInfo)) {
    if (marketsInfo.length === 0) return;
    marketsDataById = marketsInfo.reduce(
      (acc, marketData) => ({
        [marketData.id]: marketData,
        ...acc,
      }),
      {} as MarketInfos
    );
  } else {
    const market = marketsInfo as Getters.Markets.MarketInfo;
    if (Object.keys(market).length === 0) return;
    marketsDataById[market.id] = market;
  }
  const marketIds = Object.keys(marketsDataById);
  console.log('handleMarketsUpdatedChangedLog', marketIds);
  dispatch(updateMarketsData(marketsDataById));
  if (isOnDisputingPage()) dispatch(reloadDisputingPage(marketIds));
  if (isOnReportingPage()) dispatch(reloadReportingPage(marketIds));
};

export const handleMarketCreatedLog = (logs: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const userLogs = logs.filter(log =>
    isSameAddress(log.marketCreator, getState().loginAccount.address)
  );
  userLogs.map(log => {
    if (log.removed) {
      dispatch(removeMarket(log.market));
    } else {
      dispatch(loadMarketsInfo([log.market], (err, marketInfos) => {
        if (err) return console.error(err);
        Object.keys(marketInfos).map(id => {
          const market = marketInfos[id]
          if (market) {
            dispatch(
              removePendingDataByHash(market.transactionHash, CREATE_MARKET)
            );
            handleAlert(log, CREATEMARKET, false, dispatch, getState);
            dispatch(marketCreationCreated(market, log.extraInfo));
          }
        })
      }));
    }
  });
  if (userLogs.length > 0) {
    dispatch(loadAccountOnChainFrozenFundsTotals());
  }
};

export const handleReportingStateChanged = (event: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  if (event.data) {
    const marketIds = _.map(event.data, 'market');
    dispatch(loadMarketsInfo(marketIds));
  }
};

export const handleMarketMigratedLog = (log: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const universeId = getState().universe.id;
  const userAddress = getState().loginAccount.address;
  if (log.originalUniverse === universeId) {
    dispatch(removeMarket(log.market));
  } else {
    dispatch(loadMarketsInfo([log.market]));
  }
  dispatch(loadUniverseDetails(universeId, userAddress));
};

export const handleTokensTransferredLog = (logs: Logs.TokensTransferredLog[]) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { address } = getState().loginAccount;
  logs.filter(log => isSameAddress(log.from, address)).map(log => {
      // TODO: will need to update user's contribution to dispute/reporting
      // dispatch(loadReportingWindowBounds());
  })
};

export const handleTokenBalanceChangedLog = (
  logs: Logs.TokenBalanceChangedLog[]
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const { address } = getState().loginAccount;
  logs.filter(log => isSameAddress(log.owner, address)).map(log => {
    const isUserDataUpdate = isSameAddress(log.owner, address);
    if (isUserDataUpdate) {
      // dispatch(loadReportingWindowBounds());
    }
  })
};

export const handleOrderLog = (log: any) => {
  const type = log.eventType;
  switch (type) {
    case OrderEventType.Create:
      return handleOrderCreatedLog(log);
    case OrderEventType.Expire:
    case OrderEventType.Cancel:
      return handleOrderCanceledLog(log);
    case OrderEventType.Fill:
      return handleOrderFilledLog(log);
    default:
      console.log(`Unknown order event type "${log.eventType}" for log`, log);
  }
  return null;
};

export const handleOrderCreatedLog = (log: Logs.ParsedOrderEventLog) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { loginAccount, authStatus } = getState();
  const isUserDataUpdate = isSameAddress(
    log.orderCreator,
    loginAccount.mixedCaseAddress
  );
  if (isUserDataUpdate && authStatus.isLogged) {
    handleAlert(log, PUBLICTRADE, false, dispatch, getState);
    dispatch(throttleLoadUserOpenOrders());
    const pendingOrderId = constructPendingOrderid(log.amount, log.price, log.outcome, log.market)
    dispatch(removePendingOrder(pendingOrderId, log.market));
  }
  dispatch(updateMarketOrderBook(log.market));
};

export const handleOrderCanceledLog = (log: Logs.ParsedOrderEventLog) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { loginAccount, authStatus } = getState();
  const isUserDataUpdate = isSameAddress(
    log.orderCreator,
    loginAccount.mixedCaseAddress
  );
  if (isUserDataUpdate) {
    // TODO: do we need to remove stuff based on events?
    // if (!log.removed) dispatch(removeCanceledOrder(log.orderId));
    //handleAlert(log, CANCELORDER, dispatch, getState);
    const { blockchain } = getState();
    if (authStatus.isLogged) {
      dispatch(
        updateAlert(log.orderId, {
          name: CANCELORDER,
          timestamp: blockchain.currentAugurTimestamp * 1000,
          status: TXEventName.Success,
          params: { ...log },
        })
      );
      dispatch(throttleLoadUserOpenOrders());
    }
  }
  dispatch(updateMarketOrderBook(log.market));
};

export const handleOrderFilledLog = (log: Logs.ParsedOrderEventLog) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { loginAccount, authStatus } = getState();
  const { isLogged } = authStatus;
  const marketId = log.market;
  const { address } = loginAccount;
  const isUserDataUpdate =
    isSameAddress(log.orderCreator, address) ||
    isSameAddress(log.orderFiller, address);
  if (isUserDataUpdate && isLogged) {
    dispatch(
      orderFilled(marketId, log, isSameAddress(log.orderCreator, address))
    );
    dispatch(throttleLoadUserOpenOrders());
    handleAlert(log, PUBLICFILLORDER, true, dispatch, getState);
    dispatch(removePendingOrder(log.tradeGroupId, marketId));
  }
  dispatch(checkUpdateUserPositions([marketId]));
  if (isOnTradePage()) {
    dispatch(loadMarketTradingHistory(marketId));
    dispatch(updateMarketOrderBook(log.market));
  }
};

export const handleTradingProceedsClaimedLog = (
  log: Logs.TradingProceedsClaimedLog
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const isUserDataUpdate = isSameAddress(
    log.sender,
    getState().loginAccount.address
  );
  if (isUserDataUpdate) {
    const { blockchain } = getState();
    dispatch(
      updateAlert(log.market, {
        name: CLAIMTRADINGPROCEEDS,
        timestamp: blockchain.currentAugurTimestamp * 1000,
        status: TXEventName.Success,
        params: { ...log },
      })
    );
  }
};

// ---- initial reporting ----- //
export const handleInitialReportSubmittedLog = (
  logs: Logs.InitialReportSubmittedLog[]
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const address = getState().loginAccount.address;
  const userLogs = logs.filter(log => isSameAddress(log.reporter, address));
  if (userLogs.length > 0) {
    userLogs.map(log => {
      handleAlert(log, DOINITIALREPORT, false, dispatch, getState)
      dispatch(addPendingData(log.market, SUBMIT_REPORT, TXEventName.Success, '0', undefined));
    });
    dispatch(loadAccountReportingHistory());
  }
  const marketIds = userLogs.map(log => log.market)
  if (isOnReportingPage()) dispatch(reloadReportingPage(marketIds));
};

export const handleInitialReporterRedeemedLog = (
  logs: Logs.InitialReporterRedeemedLog[]
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const address = getState().loginAccount.address;
  if (logs.filter(log => isSameAddress(log.reporter, address)).length > 0)
    dispatch(loadAccountReportingHistory());
};

export const handleInitialReporterTransferredLog = (logs: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const address = getState().loginAccount.address
  if (logs.filter(log => isSameAddress(log.from, address) ||
    isSameAddress(log.to, address)).length > 0) {
    dispatch(loadAccountReportingHistory());
  }
  const marketIds = userLogs.map(log => log.market)
  if (isOnReportingPage()) dispatch(reloadReportingPage(marketIds));
};
// ---- ------------ ----- //

export const handleProfitLossChangedLog = (logs: Logs.ProfitLossChangedLog[]) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const address = getState().loginAccount.address
  if (logs.filter(log => isSameAddress(log.account, address)).length > 0)
    dispatch(loadAllAccountPositions());
};

export const handleParticipationTokensRedeemedLog = (
  logs: Logs.ParticipationTokensRedeemedLog[]
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const address = getState().loginAccount.address
  if (logs.filter(log => isSameAddress(log.account, address)).length > 0) {
    logs.map(log => handleAlert({ ...log, marketId: 1 },
      REDEEMSTAKE,
      false,
      dispatch,
      getState
    ));
    dispatch(loadAccountReportingHistory());
  }
};

export const handleReportingParticipantDisavowedLog = (
  logs: Logs.ReportingParticipantDisavowedLog[]
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const address = getState().loginAccount.address
  if (logs.filter(log => isSameAddress(log.reportingParticipant, address)).length > 0) {
    dispatch(loadAccountReportingHistory());
  }
};

export const handleMarketParticipantsDisavowedLog = (logs: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const marketIds = logs.map(log => log.market);
  dispatch(loadMarketsInfo(marketIds));
};

export const handleMarketTransferredLog = (logs: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const marketIds = logs.map(log => log.market);
  dispatch(loadMarketsInfo(marketIds));
};

export const handleUniverseForkedLog = (log: Logs.UniverseForkedLog) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('handleUniverseForkedLog');
  const { forkingMarket } = log;
  dispatch(loadUniverseForkingInfo(forkingMarket));
  if (isOnDisputingPage()) dispatch(reloadDisputingPage([]));
};

export const handleMarketFinalizedLog = (logs: Logs.MarketFinalizedLog[]) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { universe } = getState();
  logs.map(log => {
    if (universe.forkingInfo) {
      if (log.market === universe.forkingInfo.forkingMarket) {
        dispatch(loadUniverseForkingInfo());
      }
    }
  })
  const marketIds = logs.map(m => m.market);
  dispatch(checkUpdateUserPositions(marketIds));
 };

// ---- disputing ----- //
export const handleDisputeCrowdsourcerCreatedLog = (
  logs: Logs.DisputeCrowdsourcerCreatedLog[]
) => (dispatch: ThunkDispatch<void, any, Action>) => {
  if (isOnDisputingPage()) dispatch(reloadDisputingPage([]));
};

export const handleDisputeCrowdsourcerCompletedLog = (
  logs: Logs.DisputeCrowdsourcerCompletedLog[]
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  if (isOnDisputingPage()) dispatch(reloadDisputingPage([]));
};

export const handleDisputeCrowdsourcerContributionLog = (
  logs: Logs.DisputeCrowdsourcerContributionLog[]
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const userLogs = logs.filter(log => isSameAddress(
    log.reporter,
    getState().loginAccount.address
  ))
  if (userLogs.length > 0) {
    logs.map(log => {
      handleAlert(log, CONTRIBUTE, false, dispatch, getState);
      dispatch(removePendingData(log.market, SUBMIT_DISPUTE));
    });
    dispatch(loadAccountReportingHistory());
  }
  if (isOnDisputingPage()) dispatch(reloadDisputingPage([]));
};

export const handleDisputeCrowdsourcerRedeemedLog = (
  logs: Logs.DisputeCrowdsourcerRedeemedLog[]
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const userLogs = logs.filter(log => isSameAddress(
    log.reporter,
    getState().loginAccount.address
  ))
  if (userLogs.length > 0) {
    dispatch(loadAccountReportingHistory());
  }
};
// ---- ------------ ----- //

export const handleDisputeWindowCreatedLog = (
  logs: Logs.DisputeWindowCreatedLog[]
) => (dispatch: ThunkDispatch<void, any, Action>) => {
  if (logs.length > 0) {
    dispatch(loadDisputeWindow());
    dispatch(loadAccountReportingHistory());
    if (isOnDisputingPage()) dispatch(reloadDisputingPage([]));
  }
};

export const handleTokensMintedLog = (logs: Logs.TokensMinted[]) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const userAddress = getState().loginAccount.address;
  const isForking = !!getState().universe.forkingInfo;
  logs.filter(log => isSameAddress(log.target, userAddress)).map(log => {
    if (log.tokenType === Logs.TokenType.ParticipationToken) {
      dispatch(removePendingData(BUY_PARTICIPATION_TOKENS, BUY_PARTICIPATION_TOKENS));
      dispatch(loadAccountReportingHistory());
      dispatch(loadDisputeWindow());
    }
    if (log.tokenType === Logs.TokenType.ReputationToken && isForking) {
        dispatch(loadUniverseDetails(log.universe, userAddress));
    }
    if (log.tokenType === Logs.TokenType.ReputationToken && !isForking) {
        dispatch(
          updateAlert(log.blockHash, {
            id: log.blockHash,
            uniqueId: log.blockHash,
            params: {...log},
            status: TXEventName.Success,
            timestamp: getState().blockchain.currentAugurTimestamp * 1000,
            name: MIGRATE_FROM_LEG_REP_TOKEN,
          }, false));
        dispatch(addPendingData(MIGRATE_V1_V2, MIGRATE_V1_V2, TXEventName.Success, MIGRATE_V1_V2));
      }
    })
};

const EventHandlers = {
  [SubscriptionEventName.TokensTransferred]: wrapLogHandler(handleTokensTransferredLog),
  [SubscriptionEventName.TokenBalanceChanged]: wrapLogHandler(handleTokenBalanceChangedLog),
  [SubscriptionEventName.TokensMinted]: wrapLogHandler(handleTokensMintedLog),
  [SubscriptionEventName.ProfitLossChanged]: wrapLogHandler(handleProfitLossChangedLog),
  [SubscriptionEventName.DisputeWindowCreated]: wrapLogHandler(handleDisputeWindowCreatedLog),
  [SubscriptionEventName.MarketFinalized]: wrapLogHandler(handleMarketFinalizedLog),
  [SubscriptionEventName.DisputeCrowdsourcerContribution]: wrapLogHandler(
    handleDisputeCrowdsourcerContributionLog
  ),
  [SubscriptionEventName.DisputeCrowdsourcerCompleted]: wrapLogHandler(
    handleDisputeCrowdsourcerCompletedLog
  ),
  [SubscriptionEventName.DisputeCrowdsourcerRedeemed]: wrapLogHandler(
    handleDisputeCrowdsourcerRedeemedLog
  ),
  [SubscriptionEventName.DisputeCrowdsourcerCreated]: wrapLogHandler(
    handleDisputeCrowdsourcerCreatedLog
  ),
  [SubscriptionEventName.ParticipationTokensRedeemed]: wrapLogHandler(
    handleParticipationTokensRedeemedLog
  ),
  [SubscriptionEventName.ReportingParticipantDisavowed]: wrapLogHandler(
    handleReportingParticipantDisavowedLog
  ),
  [SubscriptionEventName.MarketParticipantsDisavowed]: wrapLogHandler(
    handleMarketParticipantsDisavowedLog
  ),
  [SubscriptionEventName.MarketTransferred]: wrapLogHandler(
    handleMarketTransferredLog
  ),
  [SubscriptionEventName.InitialReporterTransferred]: wrapLogHandler(
    handleInitialReporterTransferredLog
  ),
  [SubscriptionEventName.InitialReporterRedeemed]: wrapLogHandler(
    handleInitialReporterRedeemedLog
  ),
  [SubscriptionEventName.InitialReportSubmitted]: wrapLogHandler(
    handleInitialReportSubmittedLog
  ),
  [SubscriptionEventName.MarketCreated]: wrapLogHandler(
    handleMarketCreatedLog
  ),
}
