type EndScreenProps = {
  score: number
}

export function EndScreen({ score }: EndScreenProps) {
  if (score === 0) {
    return <p className="end-screen end-screen-shut">Shut the box! You win!</p>
  }
  return <p className="end-screen">Game over — score: {score}</p>
}
