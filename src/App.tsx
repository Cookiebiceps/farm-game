import { CROPS, CROP_LIST, growthEmoji } from './game/crops'
import { useFarm } from './game/useFarm'
import type { Plot } from './game/types'
import './App.css'

export default function App() {
  const farm = useFarm()
  const { state, selectedSeed, setSelectedSeed, progressFor, isReady, handlePlot } =
    farm

  return (
    <div className="app">
      <header className="topbar">
        <h1 className="title">
          <span aria-hidden>🌾</span> Farm Game
        </h1>
        <div className="stats" role="status">
          <div className="stat coins" title="Coins">
            <span aria-hidden>🪙</span>
            <span data-testid="coins">{state.coins}</span>
          </div>
          <div className="stat" title="Crops harvested">
            <span aria-hidden>🧺</span>
            <span data-testid="harvested">{state.totalHarvested}</span>
          </div>
          <div className="stat" title="Total coins earned">
            <span aria-hidden>📈</span>
            <span data-testid="earned">{state.totalEarned}</span>
          </div>
        </div>
      </header>

      <main className="layout">
        <section className="field-panel" aria-label="Farm field">
          <div className="field" data-testid="field">
            {state.plots.map((plot) => (
              <PlotTile
                key={plot.id}
                plot={plot}
                progress={progressFor(plot)}
                ready={isReady(plot)}
                onClick={() => handlePlot(plot.id)}
              />
            ))}
          </div>
        </section>

        <aside className="shop" aria-label="Seed shop">
          <h2>Seed Shop</h2>
          <p className="hint">Pick a seed, then click an empty plot to plant.</p>
          <ul className="seed-list">
            {CROP_LIST.map((crop) => {
              const selected = crop.id === selectedSeed
              const affordable = state.coins >= crop.seedCost
              return (
                <li key={crop.id}>
                  <button
                    type="button"
                    className={`seed ${selected ? 'selected' : ''}`}
                    aria-pressed={selected}
                    disabled={!affordable}
                    data-testid={`seed-${crop.id}`}
                    onClick={() => setSelectedSeed(crop.id)}
                  >
                    <span className="seed-emoji" aria-hidden>
                      {crop.emoji}
                    </span>
                    <span className="seed-info">
                      <span className="seed-name">{crop.name}</span>
                      <span className="seed-meta">
                        🪙 {crop.seedCost} → {crop.sellPrice} · {crop.growMs / 1000}s
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
          <button
            type="button"
            className="reset"
            onClick={farm.resetGame}
            data-testid="reset"
          >
            Reset farm
          </button>
        </aside>
      </main>

      <footer className="ticker" data-testid="message">
        {farm.lastMessage}
      </footer>
    </div>
  )
}

interface PlotTileProps {
  plot: Plot
  progress: number
  ready: boolean
  onClick: () => void
}

function PlotTile({ plot, progress, ready, onClick }: PlotTileProps) {
  const crop = plot.cropId ? CROPS[plot.cropId] : null
  const label = crop
    ? ready
      ? `Harvest ${crop.name}`
      : `${crop.name} growing (${Math.floor(progress * 100)}%)`
    : 'Empty plot'

  return (
    <button
      type="button"
      className={`plot ${crop ? 'planted' : 'empty'} ${ready ? 'ready' : ''}`}
      onClick={onClick}
      aria-label={label}
      title={label}
      data-testid={`plot-${plot.id}`}
      data-state={crop ? (ready ? 'ready' : 'growing') : 'empty'}
    >
      <span className="crop" aria-hidden>
        {crop ? growthEmoji(crop, progress) : ''}
      </span>
      {crop && !ready && (
        <span className="progress">
          <span className="progress-bar" style={{ width: `${progress * 100}%` }} />
        </span>
      )}
      {ready && <span className="ready-badge" aria-hidden>✨</span>}
    </button>
  )
}
