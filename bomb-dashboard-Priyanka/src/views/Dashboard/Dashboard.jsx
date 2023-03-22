import React, { useMemo, useState} from 'react';
import { Helmet } from 'react-helmet';
import { createGlobalStyle } from 'styled-components';
import Page from '../../components/Page';
import HomeImage from '../../assets/img/background.jpg';
import { Box, Card, CardContent, CardActions, Button, Typography, Grid } from '@material-ui/core';
import ProgressCountdown from '../Boardroom/components/ProgressCountdown';
import moment from 'moment';
import Divider from '@material-ui/core/Divider/Divider';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import bshares from '../../assets/img/bshares.png';
import bomb from '../../assets/img/bomb.png';
import bombBitcoinLp from '../../assets/img/bombBitcoinLp.png';
import iconArrowDownCir from '../../assets/img/iconArrowDownCir.svg';
import useCurrentEpoch from '../../hooks/useCurrentEpoch';
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import useBondStats from '../../hooks/useBondStats';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import useBoardroomTVL from '../../hooks/useBoardroomTVL';
import useBombTVL from '../../hooks/useBombTVL';
import CountUp from 'react-countup';
import { getDisplayBalance } from '../../utils/formatBalance';
import useTotalStakedOnBoardroom from '../../hooks/useTotalStakedOnBoardroom';
import useTokenBalance from '../../hooks/useTokenBalance';
import useBombFinance from '../../hooks/useBombFinance';
import useCashPriceInLastTWAP from '../../hooks/useCashPriceInLastTWAP';
import useStakedBalanceOnBoardroom from '../../hooks/useStakedBalanceOnBoardroom';
import useShareStats from '../../hooks/usebShareStats';
import DepositModal from '../Stake/components/DepositModal';
import WithdrawModal from '../Stake/components/WithdrawModal';
import useStakeToBoardroom from '../../hooks/useStakeToBoardroom';
import useWithdrawFromBomb from '../../hooks/useWithdrawFromBomb';
import useWithdrawFromBoardroom from '../../hooks/useWithdrawFromBoardroom';
import useModal from '../../hooks/useModal';
import useHarvestFromBoardroom from '../../hooks/useHarvestFromBoardroom';
import useEarningsOnBoardroom from '../../hooks/useEarningsOnBoardroom';
import useBombStats from '../../hooks/useBombStats';
import useClaimRewardCheck from '../../hooks/boardroom/useClaimRewardCheck';
import { useWallet } from 'use-wallet';
import metamask from '../../assets/img/metamask-fox.svg';
import bomb2 from '../../assets/img/bomb2.png';
import chatDiscord from '../../assets/img/chatDiscord.png';
import readDocs from '../../assets/img/readDocs.png';
import bbond from '../../assets/img/bbond.png'
import useRedeemFromBomb from '../../hooks/useRedeemFromBomb';
import useStakedBomb from '../../hooks/useStakedBomb';
import ExchangeModal from '../Bond/components/ExchangeModal';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
} 

const Dashboard = () => {
  const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage});
    background-size: cover !important;
    background-color: #171923;
  }`;

  const { account } = useWallet();
  const currentEpoch = useCurrentEpoch();
  const TITLE = 'bomb.money | Bomb Finance Summary';
  const { to } = useTreasuryAllocationTimes();
  const TVL = useTotalValueLocked();
  const boardroomTVL = useBoardroomTVL();
  const totalStaked = useTotalStakedOnBoardroom();
  const bombFinance = useBombFinance();
  const cashPrice = useCashPriceInLastTWAP();
  const bondScale = (Number(cashPrice) / 100000000000000).toFixed(4); 
  const stakedBalance = useStakedBalanceOnBoardroom();
  const stakedBomb = useStakedBomb();
  const bShareStats = useShareStats();
  const tBondStats = useBondStats();
  const bombStats = useBombStats();
  const bombTVL = useBombTVL();
  const bondBalance = useTokenBalance(bombFinance?.BBOND);
  const bondStat = useBondStats();

  // For Table 1 

  const bombPriceInBNB = useMemo(() => (bombStats ? Number(bombStats.tokenInFtm).toFixed(4) : null), [bombStats]);
  const bombCirculatingSupply = useMemo(() => (bombStats ? String(bombStats.circulatingSupply) : null), [bombStats]);
  const bombTotalSupply = useMemo(() => (bombStats ? String(bombStats.totalSupply) : null), [bombStats]);

  const bSharePriceInDollars = useMemo(() => (bShareStats ? Number(bShareStats.priceInDollars).toFixed(2) : null),[bShareStats],);
  const bShareCirculatingSupply = useMemo(() => (bShareStats ? String(bShareStats.circulatingSupply) : null),[bShareStats],);
  const bShareTotalSupply = useMemo(() => (bShareStats ? String(bShareStats.totalSupply) : null), [bShareStats]);

  const tBondPriceInDollars = useMemo(() => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),[tBondStats],);
  const tBondCirculatingSupply = useMemo(() => (tBondStats ? String(tBondStats.circulatingSupply) : null),[tBondStats],);
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);

  const rows = [
    createData({ name: '$BOMB', icon: '' }, bombCirculatingSupply, bombTotalSupply, bombPriceInBNB, 4.0),
    createData({ name: '$BSHARE', icon: '' }, bShareCirculatingSupply, bShareTotalSupply, bSharePriceInDollars, 4.3),
    createData({ name: '$BBOND', icon: '' }, tBondCirculatingSupply, tBondTotalSupply, tBondPriceInDollars, 6.0),
  ];

  const { onStake } = useStakeToBoardroom();
  const { onWithdrawBomb } = useWithdrawFromBomb();
  const { onWithdraw } = useWithdrawFromBoardroom();
  const {onReward} = useHarvestFromBoardroom();
  const { onRedeemBomb } = useRedeemFromBomb();

  const earnings = useEarningsOnBoardroom();
  const canClaimReward = useClaimRewardCheck();
  const tokenBalance = useTokenBalance(bombFinance.BOMB);

  const tokenPriceInDollars = useMemo(
    () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
    [bombStats],
  );

  const earnedInDollars = (Number(tokenPriceInDollars) * Number(getDisplayBalance(earnings))).toFixed(2);

  const [onPresentDeposit, onDismissDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={(value) => {
        onStake(value);
        onDismissDeposit();
      }}
      tokenName={'BShare'}
    />,
  );

  const [onPresentWithdraw, onDismissWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={(value) => {
        onWithdraw(value);
        onDismissWithdraw();
      }}
      tokenName={'BShare'}
    />,
  );

  const [onPresentDepositBomb, onDismissDepositBomb] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={(value) => {
        onStake(value);
        onDismissDepositBomb();
      }}
      tokenName={'LP Tokens'}
    />,
  );

  const [onPresentWithdrawBomb, onDismissWithdrawBomb] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={(value) => {
        onWithdrawBomb(value);
        onDismissWithdrawBomb();
      }}
      tokenName={'LP Tokens'}
    />,
  );

  const [onPresentRedeemBomb, onDismissRedeemBomb] = useModal(
    <WithdrawModal
      max={stakedBomb}
      onConfirm={(value) => {
        onRedeemBomb(value);
        onDismissRedeemBomb();
      }}
      tokenName={'Bonds'}
    />,
  );

  
  return (
    <div className="page-container">
    <Page>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <BackgroundImage />

      <Box mt={5} style={{ minHeight: '100vh' }}>
        <Grid container justifyContent="center" direction="column" alignItems="center">

          {/* CARD 1 */}

          {/* CARD 1 LEFT*/}

          <Card style={{ 
            border: '0.1rem solid #006699',  
            width: '100%', 
            marginBottom: '20px', 
            backgroundColor: '#20254380'
          }} >
            <CardContent style={{ textAlign: 'center' }}>
              <Typography style={{ textTransform: 'capitalize', color: '#fff', marginBottom: '10px', fontSize: '22px' }} >
                Bomb Finance Summary
              </Typography>
              <Divider light={true} style={{ backgroundColor: '#C3C5CBBF' }} />
            </CardContent>
            <CardContent style={{ textAlign: 'center', display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <TableContainer component={Paper} style={{ backgroundColor: 'transparent' }}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell align="center">Current supply</TableCell>
                        <TableCell align="center">Total supply</TableCell>
                        <TableCell align="center">Price</TableCell>
                        <TableCell align="center"></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell component="th" scope="row">
                            <div>
                              <img src="" alt=""/>
                              <Typography>{row.name.name}</Typography>
                            </div>
                          </TableCell>
                          <TableCell align="center">{row.calories}</TableCell>
                          <TableCell align="center">{row.fat}</TableCell>
                          <TableCell align="center">{row.carbs}</TableCell>
                          <TableCell align="center">
                            <img 
                              src={metamask} 
                              alt=""
                              style={{
                                height: '40px',
                                width: '40px',
                              }}/>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {/* CARD 1 RIGHT*/}
                              
              <Box style={{ marginRight: '5%' }}>
                <Typography style={{ fontSize: '18px' }}>Current Epoch</Typography>
                <Typography style={{ fontSize: '34px' }}>{Number(currentEpoch)}</Typography>
                <hr></hr>
                <div style={{fontSize: '34px'}}>
                <ProgressCountdown style={{marginTop: '0px', fontSize: '34px'}} base={moment().toDate()} hideBar={true} deadline={to} description="Next Epoch" />
                </div>
                <Typography style={{ fontSize: '18px' }}>Next Epoch in</Typography>
                <hr></hr>
                <Typography style={{ fontSize: '14px' }}>
                  Live TWAP: <span style={{ color: '#00E8A2' }}>{'-'}</span>{' '}
                </Typography>
                <Typography style={{ fontSize: '14px' }}>
                  <span style={{ fontSize: '14px' }}>TVL: </span>
                  <CountUp style={{ color: '#00E8A2' }} end={TVL} separator="," prefix="$" />
                </Typography>
                <Typography style={{ fontSize: '14px' }}>
                  Last Epoch TWAP: <span style={{ color: '#00E8A2' }}>{bondScale || '-'}</span>
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* CARD 1 ENDS */}

          {/* CARD 2 */}
          
          <Card style={{ 
            width: '100%', 
            marginBottom: '20px', 
            backgroundColor: 'transparent', 
            height: '70%' }}>
            <CardContent align="center" style={{ display: 'flex' }}>

              {/* CARD 2 BOX LEFT */}

              <Box style={{ width: `calc(68% - 10px)`, backgroundColor: 'transparent' }}>
                <div>
                
                <Typography style={{
                  fontSize: '18px',
                  marginLeft: '70%',
                  marginBottom: '2%',
                  }}><a href="#">Read Investment Strategy</a></Typography> 
                  {/* INVEST + DISCORD + DOCS BUTTON */}


                  {/* INVEST */}

                  <Box
                    style={{
                      width: '100%',
                      height: '40px',
                      backgroundColor: '#13989c',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <p style={{ verticalAlign: 'center', fontSize: '24px', fontWeight: '800' }}>Invest Now</p>
                  </Box>

                  {/* Discord */}
                  
                  <Box style={{ display: 'flex' }}>
                    <div style={{ 
                      backgroundColor: 'grey', 
                      marginTop: '1%',
                      marginBottom: '1%',
                      width: '50%',
                      height: '57px',
                      color: 'black',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                      <img alt="" src={chatDiscord} style={{
                        marginRight: '3%',
                        padding: '1%',
                        width: '9%',
                        backgroundColor: 'white',
                        borderRadius: '100%'
                      }}/>
                      <p style={{ fontSize: '18px' }}>Chat on discord</p>
                    </div>
                    
                    {/* DOCS  */}
                    
                    <div style={{ 
                      backgroundColor: 'grey', 
                      marginTop: '1%',
                      marginBottom: '1%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '48%',
                      height: '57px',
                      marginLeft: 'auto',
                      color: 'black'
                    }}>
                      <img alt="" src={readDocs} style={{
                        marginRight: '3%',
                        padding: '1%',
                        width: '9%',
                        backgroundColor: 'white',
                        borderRadius: '100%'
                      }}/>
                      <p style={{ fontSize: '18px',}}>Read on docs</p>
                    </div>
                  </Box>


                  <Box style={{
                    border: '0.1rem solid #006699',
                    backgroundColor: '#20254380',
                    height: '300px', 
                    borderRadius: '10px' 
                  }}>
                    <div style={{ display: 'flex' }}>
                      <img
                        alt="" 
                        style={{
                          height: '48px',
                          marginLeft: '20px',
                        }}
                        src={bshares}
                      />
                      <p style={{ fontSize: '22px' }}>Boardroom</p>
                      <div
                        style={{
                          backgroundColor: '#00E8A2',
                          height: '16px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: '30px',
                          marginLeft: '18px',
                          borderRadius: '5px',
                        }}
                      >
                        <p style={{ fontSize: '12px', padding: '18px' }}>Recommended</p>
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex' }}>
                        <p style={{ fontSize: '14px', marginLeft: '20px' }}>Stake BSHARE and earn BOMB every epoch</p>
                        <p style={{ fontSize: '14px', marginLeft: 'auto', marginRight: '20px' }}>TVL: </p>
                        <CountUp style={{ fontSize: '14px', marginTop: '14px', marginRight: '20px'}} end={boardroomTVL} separator="," prefix="$" />
                      </div>
                      <hr></hr>
                      <p style={{ display: 'flex', justifyContent: 'right', marginRight: '20px' }}>
                        Total Staked: {getDisplayBalance(totalStaked)}
                      </p>
                    </div>
                  
                    <div style={{ display: 'flex' }}>
                      <div style={{ width: '25%' }}>
                        <p>Daily Returns</p>
                        <p style={{ fontSize: '26px' }}>2%</p>
                      </div>

                      <div style={{ width: '20%' }}>
                        <p>Your Stake :</p>
                        <p>
                          <img
                          alt = "" 
                            style={{
                              height: '18px',
                              marginRight: '10px',
                            }}
                            src={bshares}
                          />
                          {getDisplayBalance(stakedBalance)}
                        </p>
                        <p>~$1171.62</p>
                      </div>

                      <div style={{ width: '20%' }}>
                        <p>Earned :</p>

                        <p>
                          <img
                            alt = "" 
                            style={{
                              height: '18px',
                              marginRight: '10px',
                            }}
                            src={bomb}
                          />
                          {earnedInDollars}
                        </p>

                        <p>~$298.88</p>
                      </div>

                      {/* DEPOSIT */}

                      <div style={{ marginTop: '2%', width: '35%', marginRight: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                          <div
                            style={{
                              width: '70%',
                              height: '18px',
                              border: '1px solid white',
                              borderRadius: '50px',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: '4px 10px 4px 15px',
                              marginTop: '25px',
                              cursor: 'pointer',
                            }}

                            onClick = {onPresentDeposit}
                          >
                            <span
                              style={{
                                color: 'rgba(255, 255, 255, 1)',
                                height: 'auto',
                                fontSize: 15,
                              }}
                            >
                              <span>Deposit</span>
                            </span>
                            <img
                              alt = "" 
                              style={{
                                width: '21px',
                                height: '21px',
                                position: 'relative',
                              }}
                              src={iconArrowDownCir}
                            />
                          </div>

                          {/* WITHDRAW */}

                          <div
                            style={{
                              width: '52%',
                              height: '18px',
                              border: '1px solid white',
                              borderRadius: '50px',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: '4px 10px 4px 15px',
                              marginTop: '25px',
                              marginLeft: '16px',
                              cursor: 'pointer',
                            }}

                            onClick={onPresentWithdraw}
                          >
                            <span
                              style={{
                                color: 'rgba(255, 255, 255, 1)',
                                height: 'auto',
                                textAlign: 'left',
                                fontSize: 15
                              }}
                            >
                              <span>Withdraw</span>
                            </span>

                            <img
                              alt = ""
                              style={{
                                width: '21px',
                                height: '21px',
                                position: 'relative',
                              }}
                              src={iconArrowDownCir}
                            />
                          </div>
                        </div>

                        {/* CLAIM REWARDS */}

                        <button
                          style={{
                            width: '100%',
                            height: '28px',
                            border: '1px solid white',
                            borderRadius: '50px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '4px 10px 4px 15px',
                            marginTop: '15px',
                            cursor: 'pointer',
                          }}

                          onClick={onReward}
                          className={earnings.eq(0) || !canClaimReward ? 'shinyButtonDisabled' : 'shinyButton'}
                          disabled={earnings.eq(0) || !canClaimReward}

                        >
                          <span
                            style={{
                              color: 'rgba(255, 255, 255, 1)',
                              height: 'auto',
                              textAlign: 'left',
                              fontSize: 15
                            }}
                          >
                            <span>Claim Rewards</span>
                          </span>
                          <img
                            alt = "" 
                            style={{
                              width: '21px',
                              height: '21px',
                              marginLeft: '5px'
                            }}
                            src={bomb2}
                          />
                        </button>
                      </div>
                    </div>
                  </Box>
                </div>
              </Box>

              {/* CARD 2 BOX RIGHT */}
              
              <Box style={{ 
                border: '0.1rem solid #006699', 
                width: '35%', 
                marginLeft: '25px', 
                backgroundColor: '#20254380', 
                borderRadius: '10px'
              }}>
                <div>
                  <p style={{ fontSize: '22px' }}>Latest News</p>
                </div>
              </Box>
                
              {/* BOX RIGHT ENDS */}

            </CardContent>
          </Card>

          {/* CARD 2 ENDS */}


          {/* CARD 3 */}

          <Card style={{ 
            border: '0.1rem solid #006699',
            width: '100%',
            height: '615px', 
            marginBottom: '20px', 
            backgroundColor: '#20254380' 
          }}>
            <CardContent align="center" style={{ display: 'flex' }}>
              <Box style={{ width: '100%', backgroundColor: 'transparent' }}>
                <div>
                  <div>

                    {/* BOMB FARMS */}

                    <div style={{ display: 'flex', marginBottom: '20px' }}>
                      <p style={{ fontSize: '22px' }}>Bomb Farms</p>
                      <div
                        style={{
                          backgroundColor: '#00E8A2',
                          height: '16px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: '30px',
                          marginLeft: '18px',
                          borderRadius: '5px',
                        }}
                      >
                        <p style={{ fontSize: '12px', padding: '18px' }}>Recommended</p>
                      </div>

                      {/* CLAIM ALL */}

                      <div
                            style={{
                              width: '12%',
                              height: '18px',
                              border: '1px solid white',
                              borderRadius: '50px',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: '4px 10px 4px 15px',
                              marginTop: '20px',
                              marginLeft: 'auto',
                              cursor: 'pointer',
                            }}

                            onClick={onReward}
                            className={earnings.eq(0) || !canClaimReward ? 'shinyButtonDisabled' : 'shinyButton'}
                            disabled={earnings.eq(0) || !canClaimReward}                          

                          >
                            
                            <span
                              style={{
                                color: 'rgba(255, 255, 255, 1)',
                                height: 'auto',
                                fontSize: 15
                              }}
                            >
                              <span>Claim all</span>
                            </span>
                            <img
                              alt = "" 
                              style={{
                                width: '21px',
                                height: '21px',
                                position: 'relative',
                                marginLeft: '10px',
                              }}
                              src={bomb2}
                            />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex' }}>
                        <p style={{ fontSize: '14px' }}>
                          Stake your LP tokens in our farms to start earning $BSHARE
                        </p>
                      
                      </div>
                    </div>

                    {/* BOMB BTCB */}

                    <div>
                      <div style={{ display: 'flex' }}>
                        <img
                          alt = " " 
                          style={{
                            height: '48px',
                            marginLeft: '20px',
                          }}
                          src={bombBitcoinLp}
                        />
                        <p style={{ fontSize: '22px' }}>BOMB-BTCB</p>
                        <div
                          style={{
                            backgroundColor: '#00E8A2',
                            height: '16px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: '30px',
                            marginLeft: '18px',
                            borderRadius: '5px',
                          }}
                        >
                          <p style={{ fontSize: '12px', padding: '18px' }}>Recommended</p>
                        </div>
                        <p style={{ fontSize: '14px', marginTop:'30px', marginLeft: 'auto', marginRight: '20px' }}>TVL: </p>
                        <CountUp style={{ fontSize: '14px', marginTop:'30px', marginRight: '20px' }} end={bombTVL} separator="," prefix="$" />
                      </div>
                      <hr style={{
                        marginTop: '-2px',
                        marginLeft: '5%',
                        width: '95%',
                      }}></hr>
                          
                      {/* TABLE */}
                      
                      <div style={{ display: 'flex' }}>
                      
                        <div style={{ width: '20%' }}>
                          <p>Daily Returns</p>
                          <p style={{ fontSize: '26px' }}>2%</p>
                        </div>
                        <div style={{ width: '15%' }}>
                          <p>Your Stake :</p>
                          <p>
                            <img
                            alt = "" 
                              style={{
                                height: '18px',
                                marginRight: '10px',
                              }}
                              src={bshares}
                            />
                            {getDisplayBalance(stakedBalance)}
                          </p>
                          <p>~$1171.62</p>
                        </div>

                        <div style={{ width: '15%' }}>
                          <p>Earned :</p>

                          <p>
                            <img
                              alt = "" 
                              style={{
                                height: '18px',
                                marginRight: '10px',
                              }}
                              src={bomb}
                            />
                            {earnedInDollars}
                          </p>

                          <p>~$298.88</p>
                        </div>

                        <div style={{ width: '35%', marginTop: '60px', marginLeft: '15%' }}>

                          {/* DEPOSIT */}

                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div
                              style={{
                                width: '20%',
                                height: '21px',
                                border: '1px solid white',
                                borderRadius: '50px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '4px 10px 4px 15px',
                                marginTop: '20px',
                                marginLeft: 'auto',
                                cursor: 'pointer',
                              }}

                              onClick = {onPresentDepositBomb}
                            >
                              <span
                                style={{
                                  color: 'rgba(255, 255, 255, 1)',
                                  height: 'auto',
                                  fontSize: 15
                                }}
                              >
                                <span>Deposit</span>
                              </span>
                              <img
                                alt = "" 
                                style={{
                                  width: '21px',
                                  height: '21px',
                                  position: 'relative',
                                }}
                                src={iconArrowDownCir}
                              />
                            </div>

                            {/* WITHDRAW */}

                            <div
                              style={{
                                width: '20%',
                                height: '21px',
                                border: '1px solid white',
                                borderRadius: '50px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '4px 10px 4px 15px',
                                marginTop: '20px',
                                marginLeft: 'auto',
                                cursor: 'pointer',
                              }}

                              onClick={onPresentWithdrawBomb}
                            >
                              <span
                                style={{
                                  color: 'rgba(255, 255, 255, 1)',
                                  height: 'auto',
                                  textAlign: 'left',
                                  fontSize: 15
                                }}
                              >
                                <span>Withdraw</span>
                              </span>

                              <img
                                alt = ""
                                style={{
                                  width: '21px',
                                  height: '21px',
                                  position: 'relative',
                                }}
                                src={iconArrowDownCir}
                              />
                            </div>

                            {/* CLAIM REWARDS */}

                            <div
                            style={{
                              width: '35%',
                              height: '21px',
                              border: '1px solid white',
                              borderRadius: '50px',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: '4px 10px 4px 15px',
                              marginTop: '20px',
                              marginLeft: 'auto',
                              cursor: 'pointer',
                            }}
                            
                          >
                            <span
                              style={{
                                color: 'rgba(255, 255, 255, 1)',
                                height: 'auto',
                                fontSize: 15
                              }}
                            >
                              <span>Claim rewards</span>
                            </span>
                            <img
                              alt=" " 
                              style={{
                                width: '21px',
                                height: '21px',
                                position: 'relative',
                                marginLeft: '5px',
                              }}
                              src={bomb2}
                            />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <hr style={{
                      borderColor: 'cyan',
                      marginLeft: 0,
                      marginTop: '5px',
                      width: '110%',
                      borderWidth: '1.5px',
                    }}></hr>

                    {/* BSHARE-BNB */}

                    <div>
                      <div style={{ marginTop: '3%', display: 'flex' }}>
                        <img
                          alt = " " 
                          style={{
                            height: '48px',
                            marginLeft: '20px',
                          }}
                          src={bombBitcoinLp}
                        />
                        <p style={{ fontSize: '22px' }}>BSHARE-BNB</p>
                        <div
                          style={{
                            backgroundColor: '#00E8A2',
                            height: '16px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: '30px',
                            marginLeft: '18px',
                            borderRadius: '5px',
                          }}
                        >
                          <p style={{ fontSize: '12px', padding: '18px' }}>Recommended</p>
                        </div>
                        <p style={{ fontSize: '14px', marginTop:'30px', marginLeft: 'auto', marginRight: '20px' }}>TVL: </p>
                        <CountUp style={{ fontSize: '14px', marginTop:'30px', marginRight: '20px' }} end={bombTVL} separator="," prefix="$" />

                      </div>
                      <hr style={{
                        marginTop: '-2px',
                        marginLeft: '5%',
                        width: '95%',
                      }}></hr>
                          
                      {/* TABLE */}
                      
                      <div style={{ display: 'flex' }}>
                      
                        <div style={{ width: '20%' }}>
                          <p>Daily Returns</p>
                          <p style={{ fontSize: '26px' }}>2%</p>
                        </div>
                        <div style={{ width: '15%' }}>
                          <p>Your Stake :</p>
                          <p>
                            <img
                            alt = "" 
                              style={{
                                height: '18px',
                                marginRight: '10px',
                              }}
                              src={bshares}
                            />
                            {getDisplayBalance(stakedBalance)}
                          </p>
                          <p>~$1171.62</p>
                        </div>

                        <div style={{ width: '15%' }}>
                          <p>Earned :</p>

                          <p>
                            <img
                              alt = "" 
                              style={{
                                height: '18px',
                                marginRight: '10px',
                              }}
                              src={bomb}
                            />
                            {earnedInDollars}
                          </p>

                          <p>~$298.88</p>
                        </div>

                        <div style={{ width: '35%', marginTop: '60px', marginLeft: '15%' }}>

                          {/* DEPOSIT */}

                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div
                              style={{
                                width: '20%',
                                height: '21px',
                                border: '1px solid white',
                                borderRadius: '50px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '4px 10px 4px 15px',
                                marginTop: '20px',
                                marginLeft: 'auto',
                                cursor: 'pointer',
                              }}

                              onClick = {onPresentDeposit}
                            >
                              <span
                                style={{
                                  color: 'rgba(255, 255, 255, 1)',
                                  height: 'auto',
                                  fontSize: 15
                                }}
                              >
                                <span>Deposit</span>
                              </span>
                              <img
                                alt = "" 
                                style={{
                                  width: '21px',
                                  height: '21px',
                                  position: 'relative',
                                }}
                                src={iconArrowDownCir}
                              />
                            </div>

                            {/* WITHDRAW */}

                            <div
                              style={{
                                width: '20%',
                                height: '21px',
                                border: '1px solid white',
                                borderRadius: '50px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '4px 10px 4px 15px',
                                marginTop: '20px',
                                marginLeft: 'auto',
                                cursor: 'pointer',
                              }}

                              onClick={onPresentWithdraw}
                            >
                              <span
                                style={{
                                  color: 'rgba(255, 255, 255, 1)',
                                  height: 'auto',
                                  textAlign: 'left',
                                  fontSize: 15
                                }}
                              >
                                <span>Withdraw</span>
                              </span>

                              <img
                                alt = ""
                                style={{
                                  width: '21px',
                                  height: '21px',
                                  position: 'relative',
                                }}
                                src={iconArrowDownCir}
                              />
                            </div>

                            {/* CLAIM REWARDS */}

                            <div
                            style={{
                              width: '35%',
                              height: '21px',
                              border: '1px solid white',
                              borderRadius: '50px',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: '4px 10px 4px 15px',
                              marginTop: '20px',
                              marginLeft: 'auto',
                              cursor: 'pointer',        
                            }}

                            onClick={onReward}
                            className={earnings.eq(0) || !canClaimReward ? 'shinyDivDisabled' : 'shinyDiv'}
                            disabled={earnings.eq(0) || !canClaimReward}
                          
                          >
                            <span
                              style={{
                                color: 'rgba(255, 255, 255, 1)',
                                height: 'auto',
                                fontSize: 15,
                              }}
                            >
                              <span>Claim rewards</span>
                            </span>
                            <img
                              alt=" "
                              style={{
                                width: '21px',
                                height: '21px',
                                position: 'relative',
                                marginLeft: '5px',
                              }}
                              src={bomb2}
                            />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </Box>
            </CardContent>
          </Card>

          {/* CARD 3 ENDS */}

          {/* CARD 4 */}

          <Card style={{             
            border: '0.1rem solid #006699',
            width: '100%', 
            marginBottom: '20px', 
            backgroundColor: '#20254380' }}>
            <CardContent align="left">

              <div style={{ display: 'flex' }}>
                <img
                  alt=""
                  style={{
                    height: '48px',
                    marginLeft: '20px',
                  }}
                  src={bbond}
                />
                <p style={{ fontSize: '22px' }}>Bonds</p>
                <div
                  style={{
                    backgroundColor: '#00E8A2',
                    height: '16px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '30px',
                    marginLeft: '18px',
                    borderRadius: '5px',
                  }}
                >
                  <p style={{ fontSize: '12px', padding: '18px' }}>Recommended</p>
                </div>
              </div>

              <div style={{marginRight: '10px'}}>
                <div style={{ display: 'flex' }}>
                  <p style={{ fontSize: '14px', marginLeft: '20px' }}>
                    BBOND can be purchased only on contraction periods, when TWAP of BOMB is below 1
                  </p>
                  <div style={{marginLeft: 'auto'}}>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <p style={{marginTop: '12%'}}>Purchase BBond</p>
                    <div
                      style={{
                        width: '106px',
                        height: '28px',
                        border: '1px solid white',
                        borderRadius: '50px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '4px 10px 4px 15px',
                        marginTop: '20px',
                        marginLeft: '20px',
                      }}

                      
                    >
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 1)',
                          height: 'auto',
                          textAlign: 'left',
                          lineHeight: 'normal',
                          marginRight: '19px',
                          marginBottom: '0',
                          alignSelf: 'auto',
                          fontSize: 15,
                          fontStretch: 'normal',
                          fontStyle: 'Regular',
                          fontWeight: 400,
                          textDecoration: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <span>Purchase</span>
                      </span>
                      <img
                        alt=" "
                        style={{
                          width: '21px',
                          height: '21px',
                          position: 'relative',
                        }}
                        src={iconArrowDownCir}
                      />
                    </div>
                  </div>
                  <hr></hr>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', marginLeft: '20px', marginRight: '10pxs' }}>
                <div style={{ width: '25%' }}>
                  <p>Current Price: (Bomb)^2</p>
                  <p style={{fontSize:'24px'}}>BBond = {Number(bondStat?.tokenInFtm).toFixed(4) || '-'} BTCB</p>
                </div>

                <div style={{ width: '20%' }}>
                  <p>Available to redeem:</p>
                  <p style={{fontSize:'24px'}}>
                    <img
                      alt=""
                      style={{
                        height: '18px',
                        marginRight: '10px',
                      }}
                      src={bbond}
                    />
                    {getDisplayBalance(bondBalance)}
                  </p>
                </div>
                <div style={{ marginLeft: 'auto', marginRight: '10px' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <p style={{marginTop: '12%'}}>Redeem Bomb</p>
                    <div
                      style={{
                        width: '106px',
                        height: '28px',
                        border: '1px solid white',
                        borderRadius: '50px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '4px 10px 4px 15px',
                        marginTop: '20px',
                        marginLeft: '20px',
                      }}

                      onClick = {onPresentRedeemBomb}
                    >
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 1)',
                          height: 'auto',
                          textAlign: 'left',
                          lineHeight: 'normal',
                          marginRight: '19px',
                          marginBottom: '0',
                          alignSelf: 'auto',
                          fontSize: 15,
                          fontStretch: 'normal',
                          fontStyle: 'Regular',
                          fontWeight: 400,
                          textDecoration: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <span>Redeem</span>
                      </span>
                      <img
                        alt=" "
                        style={{
                          width: '21px',
                          height: '21px',
                          position: 'relative',
                        }}
                        src={iconArrowDownCir}
                      />
                    </div>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* CARD 4 ENDS */}

        </Grid>
      </Box>
    </Page>  
    </div>
  );
};

export default Dashboard;