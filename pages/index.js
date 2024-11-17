// pages/index.js
import { useState, useEffect } from 'react';
import Head from 'next/head';

// 実験セットのデータ
const experimentSets = {
  set1: {
    name: "セット1（日本語）",
    learning: ['いす', 'そら', 'かご', 'とり', 'みち', 'はな', 'さら', 'いぬ', 'かべ', 'つえ', 'うま', 'めし', 'やま', 'うた', 'みず'],
    test: ['たな', 'くも', 'はこ', 'ねこ', 'もり', 'くさ', 'かめ', 'さる', 'にわ', 'ふで', 'ふね', 'まめ', 'うみ', 'まい', 'しお']
  },
  set2: {
    name: "セット2（日本語）",
    learning: ['つめ', 'かぜ', 'かさ', 'かに', 'うち', 'つき', 'なべ', 'むし', 'いけ', 'ほん', 'たこ', 'みそ', 'さと', 'はし', 'しる'],
    test: ['ふろ', 'ゆき', 'ふた', 'かめ', 'みせ', 'あめ', 'てら', 'へび', 'もと', 'かみ', 'あし', 'さけ', 'かわ', 'たつ', 'あき']
  },
  set3: {
    name: "セット3（日本語）",
    learning: ['ゆか', 'むら', 'かぎ', 'うし', 'そと', 'ほし', 'とぶ', 'たか', 'まち', 'はり', 'くり', 'すし', 'はま', 'つむ', 'なみ'],
    test: ['はし', 'やみ', 'ぬの', 'かも', 'しま', 'かげ', 'つな', 'くま', 'はら', 'のり', 'ゆめ', 'いも', 'みな', 'かく', 'たね']
  },
  set4: {
    name: "セット4（英語）",
    learning: ['chair', 'sky', 'bowl', 'bird', 'path', 'leaf', 'cup', 'fish', 'room', 'book', 'horse', 'bread', 'hill', 'dance', 'food'],
    test: ['desk', 'cloud', 'box', 'cat', 'road', 'tree', 'plate', 'dog', 'gate', 'pen', 'boat', 'rice', 'sea', 'walk', 'salt']
  },
  set5: {
    name: "セット5（英語）",
    learning: ['bed', 'moon', 'bag', 'duck', 'shop', 'rain', 'bowl', 'snake', 'bank', 'lamp', 'train', 'meat', 'park', 'swim', 'soup'],
    test: ['shelf', 'sun', 'lid', 'sheep', 'store', 'snow', 'rope', 'mouse', 'lane', 'tube', 'bike', 'cake', 'beach', 'run', 'juice']
  },
  set6: {
    name: "セット6（英語）",
    learning: ['couch', 'star', 'clock', 'deer', 'house', 'wind', 'cord', 'frog', 'field', 'map', 'ship', 'egg', 'lake', 'jump', 'tea'],
    test: ['stool', 'cave', 'ring', 'goat', 'hall', 'storm', 'brush', 'wolf', 'pond', 'box', 'plane', 'fruit', 'coast', 'play', 'milk']
  }
};

export default function Home() {
  const [selectedSet, setSelectedSet] = useState(null);
  const [phase, setPhase] = useState('set_selection');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [results, setResults] = useState({ correct: 0, incorrect: 0 });
  const [testWords, setTestWords] = useState([]);

  useEffect(() => {
    if (phase === 'learning' && currentWordIndex < experimentSets[selectedSet].learning.length) {
      const timer = setTimeout(() => {
        setCurrentWordIndex(prev => prev + 1);
      }, 2000);

      if (currentWordIndex === experimentSets[selectedSet].learning.length - 1) {
        const phaseTimer = setTimeout(() => {
          setPhase('interval');
        }, 2000);
        return () => {
          clearTimeout(timer);
          clearTimeout(phaseTimer);
        };
      }

      return () => clearTimeout(timer);
    }
  }, [phase, currentWordIndex, selectedSet]);

  const resetTask = () => {
    setPhase('set_selection');
    setSelectedSet(null);
    setCurrentWordIndex(0);
    setResponses([]);
    setResults({ correct: 0, incorrect: 0 });
    setTestWords([]);
  };

  const selectSet = (set) => {
    setSelectedSet(set);
    setPhase('start');
  };

  const startTask = () => {
    setPhase('learning');
    setCurrentWordIndex(0);
    setResponses([]);
    setResults({ correct: 0, incorrect: 0 });

    const learningWords = [...experimentSets[selectedSet].learning]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
    const testingWords = [...experimentSets[selectedSet].test]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
    const mixedWords = [...learningWords, ...testingWords]
      .sort(() => Math.random() - 0.5);
    setTestWords(mixedWords);
  };

  const startTest = () => {
    setPhase('test');
    setCurrentWordIndex(0);
  };

  const handleResponse = (word, seen) => {
    const wasActuallySeen = experimentSets[selectedSet].learning.includes(word);
    const isCorrect = seen === wasActuallySeen;

    setResponses([...responses, { word, response: seen, correct: isCorrect }]);
    setResults(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (isCorrect ? 0 : 1)
    }));

    if (currentWordIndex < testWords.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
    } else {
      setPhase('end');
    }
  };

  return (
    <div>
      <Head>
        <title>単語記憶課題</title>
        <meta name="description" content="単語記憶課題アプリケーション" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen p-4">
        <div className="max-w-lg mx-auto">
          {phase === 'set_selection' ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h1 className="text-2xl font-bold text-center mb-6">実験セットの選択</h1>
              <div className="space-y-4">
                <p className="text-center mb-4">使用する実験セットを選択してください：</p>
                <div className="space-y-2">
                  {Object.entries(experimentSets).map(([key, set]) => (
                    <button
                      key={key}
                      onClick={() => selectSet(key)}
                      className="w-full py-4 px-6 text-lg bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                      {set.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 relative">
              <button
                onClick={resetTask}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
                title="リセット"
              >
                ×
              </button>
              <h1 className="text-2xl font-bold text-center mb-6">
                単語記憶課題 - {experimentSets[selectedSet].name}
              </h1>

              {phase === 'start' && (
                <div className="text-center space-y-4">
                  <p>これから15個の単語を順番に提示します。</p>
                  <p>それぞれの単語をよく覚えてください。</p>
                  <p>その後、20個の単語を提示します。</p>
                  <p>先ほど覚えた単語が出てきたら「見た」、初めて見る単語なら「見てない」を選んでください。</p>
                  <button
                    onClick={startTask}
                    className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    開始
                  </button>
                </div>
              )}

              {phase === 'learning' && currentWordIndex < experimentSets[selectedSet].learning.length && (
                <div className="text-center space-y-4">
                  <p className="text-sm">覚えてください</p>
                  <p className="text-4xl font-bold my-8">
                    {experimentSets[selectedSet].learning[currentWordIndex]}
                  </p>
                  <p className="text-sm">
                    {currentWordIndex + 1} / {experimentSets[selectedSet].learning.length}
                  </p>
                </div>
              )}

              {phase === 'interval' && (
                <div className="text-center space-y-4">
                  <p>学習フェーズが終了しました</p>
                  <p>準備ができましたら、テストを開始してください</p>
                  <button
                    onClick={startTest}
                    className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    テストを開始
                  </button>
                </div>
              )}

              {phase === 'test' && currentWordIndex < testWords.length && (
                <div className="text-center space-y-4">
                  <p className="text-4xl font-bold my-8">
                    {testWords[currentWordIndex]}
                  </p>
                  <p className="text-sm">
                    {currentWordIndex + 1} / {testWords.length}
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => handleResponse(testWords[currentWordIndex], true)}
                      className="px-8 py-4 bg-green-500 text-white text-lg rounded hover:bg-green-600"
                    >
                      見た
                    </button>
                    <button
                      onClick={() => handleResponse(testWords[currentWordIndex], false)}
                      className="px-8 py-4 bg-red-500 text-white text-lg rounded hover:bg-red-600"
                    >
                      見てない
                    </button>
                  </div>
                </div>
              )}

              {phase === 'end' && (
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-bold">結果 - {experimentSets[selectedSet].name}</h3>
                  <p>正答数: {results.correct}</p>
                  <p>誤答数: {results.incorrect}</p>
                  <p>正答率: {((results.correct / testWords.length) * 100).toFixed(1)}%</p>
                  <div className="space-x-2">
                    <button
                      onClick={() => setPhase('set_selection')}
                      className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      セット選択に戻る
                    </button>
                    <button
                      onClick={startTask}
                      className="mt-4 px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      同じセットでもう一度
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
