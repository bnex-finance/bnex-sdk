import JSBI from 'jsbi'
import { ChainId, BNB, CurrencyAmount, Pair, Percent, Route, Token, TokenAmount, Trade, TradeType, WBNB } from '../src'

describe('Trade', () => {
  const token0 = new Token(ChainId.MAINNET, '0x0000000000000000000000000000000000000001', 18, 't0')
  const token1 = new Token(ChainId.MAINNET, '0x0000000000000000000000000000000000000002', 18, 't1')
  const token2 = new Token(ChainId.MAINNET, '0x0000000000000000000000000000000000000003', 18, 't2')
  const token3 = new Token(ChainId.MAINNET, '0x0000000000000000000000000000000000000004', 18, 't3')

  const pair_0_1 = new Pair(
    new TokenAmount(token0, BigNumber.from(1000)),
    new TokenAmount(token1, BigNumber.from(1000))
  )
  const pair_0_2 = new Pair(
    new TokenAmount(token0, BigNumber.from(1000)),
    new TokenAmount(token2, BigNumber.from(1100))
  )
  const pair_0_3 = new Pair(new TokenAmount(token0, BigNumber.from(1000)), new TokenAmount(token3, BigNumber.from(900)))
  const pair_1_2 = new Pair(
    new TokenAmount(token1, BigNumber.from(1200)),
    new TokenAmount(token2, BigNumber.from(1000))
  )
  const pair_1_3 = new Pair(
    new TokenAmount(token1, BigNumber.from(1200)),
    new TokenAmount(token3, BigNumber.from(1300))
  )

  const pair_weth_0 = new Pair(
    new TokenAmount(WBNB[ChainId.MAINNET], BigNumber.from(1000)),
    new TokenAmount(token0, BigNumber.from(1000))
  )

  const empty_pair_0_1 = new Pair(
    new TokenAmount(token0, BigNumber.from(0)),
    new TokenAmount(token1, BigNumber.from(0))
  )

  it('can be constructed with BNB as input', () => {
    const trade = new Trade(
      new Route([pair_weth_0], BNB),
      CurrencyAmount.ether(BigNumber.from(100)),
      TradeType.EXACT_INPUT
    )
    expect(trade.inputAmount.currency).toEqual(BNB)
    expect(trade.outputAmount.currency).toEqual(token0)
  })
  it('can be constructed with BNB as input for exact output', () => {
    const trade = new Trade(
      new Route([pair_weth_0], BNB, token0),
      new TokenAmount(token0, BigNumber.from(100)),
      TradeType.EXACT_OUTPUT
    )
    expect(trade.inputAmount.currency).toEqual(BNB)
    expect(trade.outputAmount.currency).toEqual(token0)
  })

  it('can be constructed with BNB as output', () => {
    const trade = new Trade(
      new Route([pair_weth_0], token0, BNB),
      CurrencyAmount.ether(BigNumber.from(100)),
      TradeType.EXACT_OUTPUT
    )
    expect(trade.inputAmount.currency).toEqual(token0)
    expect(trade.outputAmount.currency).toEqual(BNB)
  })
  it('can be constructed with BNB as output for exact input', () => {
    const trade = new Trade(
      new Route([pair_weth_0], token0, BNB),
      new TokenAmount(token0, BigNumber.from(100)),
      TradeType.EXACT_INPUT
    )
    expect(trade.inputAmount.currency).toEqual(token0)
    expect(trade.outputAmount.currency).toEqual(BNB)
  })

  describe('#bestTradeExactIn', () => {
    it('throws with empty pairs', () => {
      expect(() => Trade.bestTradeExactIn([], new TokenAmount(token0, BigNumber.from(100)), token2)).toThrow('PAIRS')
    })
    it('throws with max hops of 0', () => {
      expect(() =>
        Trade.bestTradeExactIn([pair_0_2], new TokenAmount(token0, BigNumber.from(100)), token2, { maxHops: 0 })
      ).toThrow('MAX_HOPS')
    })

    it('provides best route', () => {
      const result = Trade.bestTradeExactIn(
        [pair_0_1, pair_0_2, pair_1_2],
        new TokenAmount(token0, BigNumber.from(100)),
        token2
      )
      expect(result).toHaveLength(2)
      expect(result[0].route.pairs).toHaveLength(1) // 0 -> 2 at 10:11
      expect(result[0].route.path).toEqual([token0, token2])
      expect(result[0].inputAmount).toEqual(new TokenAmount(token0, BigNumber.from(100)))
      expect(result[0].outputAmount).toEqual(new TokenAmount(token2, BigNumber.from(99)))
      expect(result[1].route.pairs).toHaveLength(2) // 0 -> 1 -> 2 at 12:12:10
      expect(result[1].route.path).toEqual([token0, token1, token2])
      expect(result[1].inputAmount).toEqual(new TokenAmount(token0, BigNumber.from(100)))
      expect(result[1].outputAmount).toEqual(new TokenAmount(token2, BigNumber.from(69)))
    })

    it('doesnt throw for zero liquidity pairs', () => {
      expect(
        Trade.bestTradeExactIn([empty_pair_0_1], new TokenAmount(token0, BigNumber.from(100)), token1)
      ).toHaveLength(0)
    })

    it('respects maxHops', () => {
      const result = Trade.bestTradeExactIn(
        [pair_0_1, pair_0_2, pair_1_2],
        new TokenAmount(token0, BigNumber.from(10)),
        token2,
        { maxHops: 1 }
      )
      expect(result).toHaveLength(1)
      expect(result[0].route.pairs).toHaveLength(1) // 0 -> 2 at 10:11
      expect(result[0].route.path).toEqual([token0, token2])
    })

    it('insufficient input for one pair', () => {
      const result = Trade.bestTradeExactIn(
        [pair_0_1, pair_0_2, pair_1_2],
        new TokenAmount(token0, BigNumber.from(1)),
        token2
      )
      expect(result).toHaveLength(1)
      expect(result[0].route.pairs).toHaveLength(1) // 0 -> 2 at 10:11
      expect(result[0].route.path).toEqual([token0, token2])
      expect(result[0].outputAmount).toEqual(new TokenAmount(token2, BigNumber.from(1)))
    })

    it('respects n', () => {
      const result = Trade.bestTradeExactIn(
        [pair_0_1, pair_0_2, pair_1_2],
        new TokenAmount(token0, BigNumber.from(10)),
        token2,
        { maxNumResults: 1 }
      )

      expect(result).toHaveLength(1)
    })

    it('no path', () => {
      const result = Trade.bestTradeExactIn(
        [pair_0_1, pair_0_3, pair_1_3],
        new TokenAmount(token0, BigNumber.from(10)),
        token2
      )
      expect(result).toHaveLength(0)
    })

    it('works for BNB currency input', () => {
      const result = Trade.bestTradeExactIn(
        [pair_weth_0, pair_0_1, pair_0_3, pair_1_3],
        CurrencyAmount.ether(BigNumber.from(100)),
        token3
      )
      expect(result).toHaveLength(2)
      expect(result[0].inputAmount.currency).toEqual(BNB)
      expect(result[0].route.path).toEqual([WBNB[ChainId.MAINNET], token0, token1, token3])
      expect(result[0].outputAmount.currency).toEqual(token3)
      expect(result[1].inputAmount.currency).toEqual(BNB)
      expect(result[1].route.path).toEqual([WBNB[ChainId.MAINNET], token0, token3])
      expect(result[1].outputAmount.currency).toEqual(token3)
    })
    it('works for BNB currency output', () => {
      const result = Trade.bestTradeExactIn(
        [pair_weth_0, pair_0_1, pair_0_3, pair_1_3],
        new TokenAmount(token3, BigNumber.from(100)),
        BNB
      )
      expect(result).toHaveLength(2)
      expect(result[0].inputAmount.currency).toEqual(token3)
      expect(result[0].route.path).toEqual([token3, token0, WBNB[ChainId.MAINNET]])
      expect(result[0].outputAmount.currency).toEqual(BNB)
      expect(result[1].inputAmount.currency).toEqual(token3)
      expect(result[1].route.path).toEqual([token3, token1, token0, WBNB[ChainId.MAINNET]])
      expect(result[1].outputAmount.currency).toEqual(BNB)
    })
  })

  describe('#maximumAmountIn', () => {
    describe('tradeType = EXACT_INPUT', () => {
      const exactIn = new Trade(
        new Route([pair_0_1, pair_1_2], token0),
        new TokenAmount(token0, BigNumber.from(100)),
        TradeType.EXACT_INPUT
      )
      it('throws if less than 0', () => {
        expect(() => exactIn.maximumAmountIn(new Percent(BigNumber.from(-1), BigNumber.from(100)))).toThrow(
          'SLIPPAGE_TOLERANCE'
        )
      })
      it('returns exact if 0', () => {
        expect(exactIn.maximumAmountIn(new Percent(BigNumber.from(0), BigNumber.from(100)))).toEqual(
          exactIn.inputAmount
        )
      })
      it('returns exact if nonzero', () => {
        expect(exactIn.maximumAmountIn(new Percent(BigNumber.from(0), BigNumber.from(100)))).toEqual(
          new TokenAmount(token0, BigNumber.from(100))
        )
        expect(exactIn.maximumAmountIn(new Percent(BigNumber.from(5), BigNumber.from(100)))).toEqual(
          new TokenAmount(token0, BigNumber.from(100))
        )
        expect(exactIn.maximumAmountIn(new Percent(BigNumber.from(200), BigNumber.from(100)))).toEqual(
          new TokenAmount(token0, BigNumber.from(100))
        )
      })
    })
    describe('tradeType = EXACT_OUTPUT', () => {
      const exactOut = new Trade(
        new Route([pair_0_1, pair_1_2], token0),
        new TokenAmount(token2, BigNumber.from(100)),
        TradeType.EXACT_OUTPUT
      )

      it('throws if less than 0', () => {
        expect(() => exactOut.maximumAmountIn(new Percent(BigNumber.from(-1), BigNumber.from(100)))).toThrow(
          'SLIPPAGE_TOLERANCE'
        )
      })
      it('returns exact if 0', () => {
        expect(exactOut.maximumAmountIn(new Percent(BigNumber.from(0), BigNumber.from(100)))).toEqual(
          exactOut.inputAmount
        )
      })
      it('returns slippage amount if nonzero', () => {
        expect(exactOut.maximumAmountIn(new Percent(BigNumber.from(0), BigNumber.from(100)))).toEqual(
          new TokenAmount(token0, BigNumber.from(156))
        )
        expect(exactOut.maximumAmountIn(new Percent(BigNumber.from(5), BigNumber.from(100)))).toEqual(
          new TokenAmount(token0, BigNumber.from(163))
        )
        expect(exactOut.maximumAmountIn(new Percent(BigNumber.from(200), BigNumber.from(100)))).toEqual(
          new TokenAmount(token0, BigNumber.from(468))
        )
      })
    })
  })

  describe('#minimumAmountOut', () => {
    describe('tradeType = EXACT_INPUT', () => {
      const exactIn = new Trade(
        new Route([pair_0_1, pair_1_2], token0),
        new TokenAmount(token0, BigNumber.from(100)),
        TradeType.EXACT_INPUT
      )
      it('throws if less than 0', () => {
        expect(() => exactIn.minimumAmountOut(new Percent(BigNumber.from(-1), BigNumber.from(100)))).toThrow(
          'SLIPPAGE_TOLERANCE'
        )
      })
      it('returns exact if 0', () => {
        expect(exactIn.minimumAmountOut(new Percent(BigNumber.from(0), BigNumber.from(100)))).toEqual(
          exactIn.outputAmount
        )
      })
      it('returns exact if nonzero', () => {
        expect(exactIn.minimumAmountOut(new Percent(BigNumber.from(0), BigNumber.from(100)))).toEqual(
          new TokenAmount(token2, BigNumber.from(69))
        )
        expect(exactIn.minimumAmountOut(new Percent(BigNumber.from(5), BigNumber.from(100)))).toEqual(
          new TokenAmount(token2, BigNumber.from(65))
        )
        expect(exactIn.minimumAmountOut(new Percent(BigNumber.from(200), BigNumber.from(100)))).toEqual(
          new TokenAmount(token2, BigNumber.from(23))
        )
      })
    })
    describe('tradeType = EXACT_OUTPUT', () => {
      const exactOut = new Trade(
        new Route([pair_0_1, pair_1_2], token0),
        new TokenAmount(token2, BigNumber.from(100)),
        TradeType.EXACT_OUTPUT
      )

      it('throws if less than 0', () => {
        expect(() => exactOut.minimumAmountOut(new Percent(BigNumber.from(-1), BigNumber.from(100)))).toThrow(
          'SLIPPAGE_TOLERANCE'
        )
      })
      it('returns exact if 0', () => {
        expect(exactOut.minimumAmountOut(new Percent(BigNumber.from(0), BigNumber.from(100)))).toEqual(
          exactOut.outputAmount
        )
      })
      it('returns slippage amount if nonzero', () => {
        expect(exactOut.minimumAmountOut(new Percent(BigNumber.from(0), BigNumber.from(100)))).toEqual(
          new TokenAmount(token2, BigNumber.from(100))
        )
        expect(exactOut.minimumAmountOut(new Percent(BigNumber.from(5), BigNumber.from(100)))).toEqual(
          new TokenAmount(token2, BigNumber.from(100))
        )
        expect(exactOut.minimumAmountOut(new Percent(BigNumber.from(200), BigNumber.from(100)))).toEqual(
          new TokenAmount(token2, BigNumber.from(100))
        )
      })
    })
  })

  describe('#bestTradeExactOut', () => {
    it('throws with empty pairs', () => {
      expect(() => Trade.bestTradeExactOut([], token0, new TokenAmount(token2, BigNumber.from(100)))).toThrow('PAIRS')
    })
    it('throws with max hops of 0', () => {
      expect(() =>
        Trade.bestTradeExactOut([pair_0_2], token0, new TokenAmount(token2, BigNumber.from(100)), { maxHops: 0 })
      ).toThrow('MAX_HOPS')
    })

    it('provides best route', () => {
      const result = Trade.bestTradeExactOut(
        [pair_0_1, pair_0_2, pair_1_2],
        token0,
        new TokenAmount(token2, BigNumber.from(100))
      )
      expect(result).toHaveLength(2)
      expect(result[0].route.pairs).toHaveLength(1) // 0 -> 2 at 10:11
      expect(result[0].route.path).toEqual([token0, token2])
      expect(result[0].inputAmount).toEqual(new TokenAmount(token0, BigNumber.from(101)))
      expect(result[0].outputAmount).toEqual(new TokenAmount(token2, BigNumber.from(100)))
      expect(result[1].route.pairs).toHaveLength(2) // 0 -> 1 -> 2 at 12:12:10
      expect(result[1].route.path).toEqual([token0, token1, token2])
      expect(result[1].inputAmount).toEqual(new TokenAmount(token0, BigNumber.from(156)))
      expect(result[1].outputAmount).toEqual(new TokenAmount(token2, BigNumber.from(100)))
    })

    it('doesnt throw for zero liquidity pairs', () => {
      expect(
        Trade.bestTradeExactOut([empty_pair_0_1], token1, new TokenAmount(token1, BigNumber.from(100)))
      ).toHaveLength(0)
    })

    it('respects maxHops', () => {
      const result = Trade.bestTradeExactOut(
        [pair_0_1, pair_0_2, pair_1_2],
        token0,
        new TokenAmount(token2, BigNumber.from(10)),
        { maxHops: 1 }
      )
      expect(result).toHaveLength(1)
      expect(result[0].route.pairs).toHaveLength(1) // 0 -> 2 at 10:11
      expect(result[0].route.path).toEqual([token0, token2])
    })

    it('insufficient liquidity', () => {
      const result = Trade.bestTradeExactOut(
        [pair_0_1, pair_0_2, pair_1_2],
        token0,
        new TokenAmount(token2, BigNumber.from(1200))
      )
      expect(result).toHaveLength(0)
    })

    it('insufficient liquidity in one pair but not the other', () => {
      const result = Trade.bestTradeExactOut(
        [pair_0_1, pair_0_2, pair_1_2],
        token0,
        new TokenAmount(token2, BigNumber.from(1050))
      )
      expect(result).toHaveLength(1)
    })

    it('respects n', () => {
      const result = Trade.bestTradeExactOut(
        [pair_0_1, pair_0_2, pair_1_2],
        token0,
        new TokenAmount(token2, BigNumber.from(10)),
        { maxNumResults: 1 }
      )

      expect(result).toHaveLength(1)
    })

    it('no path', () => {
      const result = Trade.bestTradeExactOut(
        [pair_0_1, pair_0_3, pair_1_3],
        token0,
        new TokenAmount(token2, BigNumber.from(10))
      )
      expect(result).toHaveLength(0)
    })

    it('works for BNB currency input', () => {
      const result = Trade.bestTradeExactOut(
        [pair_weth_0, pair_0_1, pair_0_3, pair_1_3],
        BNB,
        new TokenAmount(token3, BigNumber.from(100))
      )
      expect(result).toHaveLength(2)
      expect(result[0].inputAmount.currency).toEqual(BNB)
      expect(result[0].route.path).toEqual([WBNB[ChainId.MAINNET], token0, token1, token3])
      expect(result[0].outputAmount.currency).toEqual(token3)
      expect(result[1].inputAmount.currency).toEqual(BNB)
      expect(result[1].route.path).toEqual([WBNB[ChainId.MAINNET], token0, token3])
      expect(result[1].outputAmount.currency).toEqual(token3)
    })
    it('works for BNB currency output', () => {
      const result = Trade.bestTradeExactOut(
        [pair_weth_0, pair_0_1, pair_0_3, pair_1_3],
        token3,
        CurrencyAmount.ether(BigNumber.from(100))
      )
      expect(result).toHaveLength(2)
      expect(result[0].inputAmount.currency).toEqual(token3)
      expect(result[0].route.path).toEqual([token3, token0, WBNB[ChainId.MAINNET]])
      expect(result[0].outputAmount.currency).toEqual(BNB)
      expect(result[1].inputAmount.currency).toEqual(token3)
      expect(result[1].route.path).toEqual([token3, token1, token0, WBNB[ChainId.MAINNET]])
      expect(result[1].outputAmount.currency).toEqual(BNB)
    })
  })
})
