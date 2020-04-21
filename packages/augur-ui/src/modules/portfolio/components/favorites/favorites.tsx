import React, { Component } from 'react';

import FilterBox from 'modules/portfolio/containers/filter-box';
import { MarketProgress } from 'modules/common/progress';
import { FavoritesButton } from 'modules/common/buttons';
import { END_TIME, THEMES } from 'modules/common/constants';

import Styles from 'modules/portfolio/components/common/quad.styles.less';
import favoriteStyles from 'modules/portfolio/components/favorites/favorites.styles.less';
import { MarketData } from 'modules/types';
import { useAppStatusStore } from 'modules/app/store/app-status';

const sortByOptions = [
  {
    label: 'Most Recently Added',
    value: 'recentlyTraded',
    comp(marketA, marketB) {
      return marketB.favoriteAddedData - marketA.favoriteAddedData;
    },
  },
  {
    label: 'Market Creation',
    value: 'marketCreation',
    comp(marketA, marketB) {
      return marketB.creationTime - marketA.creationTime;
    },
  },
  {
    label: 'Expiring Soonest',
    value: END_TIME,
    comp(marketA, marketB) {
      return marketA.endTime.timestamp - marketB.endTime.timestamp;
    },
  },
];

function filterComp(input, market) {
  if (!market) return false;
  return market.description
    ? market.description.toLowerCase().indexOf(input.toLowerCase()) >= 0
    : true;
}

interface FavoritesProps {
  markets: Array<MarketData>;
  currentAugurTimestamp: number;
  toggleFavorite: Function;
  toggle: Function;
}

const Favorites = ({
  markets,
  currentAugurTimestamp,
  toggleFavorite,
  toggle,
}: FavoritesProps) => {
  const { theme } = useAppStatusStore();
  const isTrading = theme === THEMES.TRADING;
  let customClass = favoriteStyles.Watchlist;
  if (!isTrading && markets.length === 0) {
    customClass = favoriteStyles.WatchlistEmptyDisplay;
  }

  function renderRightContent(market) {
    return (
      <div className={Styles.MultiColumn}>
        <MarketProgress
          reportingState={market.reportingState}
          currentTime={currentAugurTimestamp}
          endTimeFormatted={market.endTimeFormatted}
          reportingWindowEndTime={
            (market.disputeInfo &&
              market.disputeInfo.disputeWindow &&
              market.disputeInfo.disputeWindow.endTime) ||
            0
          }
          alignRight
        />
        <FavoritesButton
          action={() => toggleFavorite(market.id)}
          isFavorite
          hideText
          isSmall
        />
      </div>
    );
  };

  return (
    <FilterBox
      title={isTrading ? 'Watchlist' : 'Favorites'}
      customClass={customClass}
      sortByOptions={sortByOptions}
      sortByStyles={{ minWidth: '10.625rem' }}
      markets={markets}
      filterComp={filterComp}
      renderRightContent={renderRightContent}
      noToggle
      filterLabel="markets"
      toggle={toggle}
      pickVariables={[
        'id',
        'favoriteAddedData',
        'description',
        'reportingState',
        'endTime',
        'creationTime',
      ]}
    />
  );
};

export default Favorites;
