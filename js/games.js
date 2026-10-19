/* =========================================================
   ИГРЫ: Трактор-тапалка + Жуки на поле + Пазл «Пятнашки»
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     1. ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК
     ========================================================= */
  const tabs   = document.querySelectorAll('.game-tab');
  const panels = document.querySelectorAll('.game-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.toggle('active', t === tab));
      panels.forEach(p => p.classList.toggle('active', p.id === 'panel-' + target));
    });
  });

  /* =========================================================
     2. ИГРА «ТРАКТОР-ТАПАЛКА»
     ========================================================= */
  const TAP_KEY = 'tractorTapHighscore';

  const tapStart       = document.getElementById('tapStart');
  const tapArea        = document.getElementById('tapArea');
  const tapField       = document.getElementById('tapField');
  const tapTarget      = document.getElementById('tapTarget');
  const tapScoreEl     = document.getElementById('tapScore');
  const tapRecordEl    = document.getElementById('tapRecord');
  const tapRecordBadge = document.getElementById('tapRecordBadge');
  const tapRecordVal   = document.getElementById('tapRecordVal');
  const tapToast       = document.getElementById('tapToast');
  const tapStartBtn    = document.getElementById('tapStartBtn');
  const tapResetBtn    = document.getElementById('tapReset');
  const tapBackBtn     = document.getElementById('tapBack');
  const tapHint        = tapField ? tapField.querySelector('.hint') : null;

  if (tapField) {
    let tapCount  = 0;
    let tapBest   = parseInt(localStorage.getItem(TAP_KEY) || '0', 10);
    let tapActive = false;
    let toastTimer = null;

    function loadTapRecord() {
      tapRecordEl.textContent = tapBest;
      if (tapBest > 0) {
        tapRecordVal.textContent = tapBest;
        tapRecordBadge.classList.remove('hidden');
      }
    }

    function showTapToast() {
      tapToast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => tapToast.classList.remove('show'), 1500);
    }

    function saveTapRecord() {
      if (tapCount > tapBest) {
        tapBest = tapCount;
        localStorage.setItem(TAP_KEY, String(tapBest));
        tapRecordEl.textContent = tapBest;
        tapRecordVal.textContent = tapBest;
        tapRecordBadge.classList.remove('hidden');
        showTapToast();
      }
    }

    function handleTap(e) {
      if (!tapActive) return;

      const rect = tapTarget.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const hitRadius = Math.min(rect.width, rect.height) * 0.42;
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
      if (dist > hitRadius) return;

      tapCount++;
      tapScoreEl.textContent = tapCount;
      if (tapCount > tapBest) saveTapRecord();

      tapTarget.classList.add('punch');
      setTimeout(() => tapTarget.classList.remove('punch'), 90);

      tapField.classList.remove('shake');
      void tapField.offsetWidth;
      tapField.classList.add('shake');

      const fieldRect = tapField.getBoundingClientRect();
      const fpx = ((e.clientX - fieldRect.left) / fieldRect.width) * 100;
      const fpy = ((e.clientY - fieldRect.top) / fieldRect.height) * 100;

      const pop = document.createElement('div');
      pop.className = 'pop';
      pop.textContent = '+1';
      pop.style.left = fpx + '%';
      pop.style.top  = fpy + '%';
      tapField.appendChild(pop);
      setTimeout(() => pop.remove(), 750);

      for (let i = 0; i < 6; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = fpx + '%';
        p.style.top  = fpy + '%';
        const angle = Math.random() * Math.PI * 2;
        const d = 40 + Math.random() * 60;
        p.style.setProperty('--dx', `calc(-50% + ${Math.cos(angle) * d}px)`);
        p.style.setProperty('--dy', `calc(-50% + ${Math.sin(angle) * d}px)`);
        tapField.appendChild(p);
        setTimeout(() => p.remove(), 550);
      }

      if (tapHint) tapHint.style.opacity = '0';
    }

    function startTap() {
      tapStart.classList.add('hidden');
      tapArea.classList.remove('hidden');
      tapActive = true;
      if (tapHint) tapHint.style.opacity = '1';
    }

    function resetTap() {
      tapCount = 0;
      tapScoreEl.textContent = '0';
      tapField.querySelectorAll('.pop, .particle').forEach(el => el.remove());
      if (tapHint) tapHint.style.opacity = '1';
    }

    function backTap() {
      tapActive = false;
      tapArea.classList.add('hidden');
      tapStart.classList.remove('hidden');
    }

    tapField.addEventListener('pointerdown', handleTap);
    tapStartBtn.addEventListener('click', startTap);
    tapResetBtn.addEventListener('click', resetTap);
    tapBackBtn.addEventListener('click', backTap);

    document.addEventListener('dblclick', e => e.preventDefault(), { passive: false });

    loadTapRecord();
  }

  /* =========================================================
     3. ИГРА «ЖУКИ НА ПОЛЕ»
     ========================================================= */
  const bugsStart      = document.getElementById('bugsStart');
  const bugsArea       = document.getElementById('bugsArea');
  const bugsField      = document.getElementById('bugsField');
  const bugsScoreEl    = document.getElementById('bugsScore');
  const bugsTimeEl     = document.getElementById('bugsTime');
  const bugsOver       = document.getElementById('bugsOver');
  const bugsFinalScore = document.getElementById('bugsFinalScore');
  const bugsVerdict    = document.getElementById('bugsVerdict');
  const bugsStartBtn   = document.getElementById('bugsStartBtn');
  const bugsAgainBtn   = document.getElementById('bugsAgain');
  const bugsBackBtn    = document.getElementById('bugsBack');

  if (bugsField) {
    const BUG_COLORS = [
      '#5a2c08',
      '#7a1a1a',
      '#2d4a15',
      '#1a1a4a',
      '#4a1a4a',
      '#5a4a08'
    ];

    let bugScore          = 0;
    let bugTimeLeft       = 30;
    let bugActive         = false;
    let bugSpawnTimer     = null;
    let bugCountdownTimer = null;

    function bugSVG(color) {
      return `
        <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
          <g stroke="#1a0f06" stroke-width="3" stroke-linecap="round">
            <line x1="32" y1="24" x2="10" y2="14"/>
            <line x1="32" y1="32" x2="6"  y2="32"/>
            <line x1="32" y1="40" x2="10" y2="50"/>
            <line x1="32" y1="24" x2="54" y2="14"/>
            <line x1="32" y1="32" x2="58" y2="32"/>
            <line x1="32" y1="40" x2="54" y2="50"/>
          </g>
          <ellipse cx="32" cy="34" rx="16" ry="20" fill="${color}" stroke="#1a0f06" stroke-width="2"/>
          <line x1="32" y1="16" x2="32" y2="52" stroke="#1a0f06" stroke-width="2"/>
          <circle cx="32" cy="16" r="8" fill="#2b1d10" stroke="#1a0f06" stroke-width="2"/>
          <line x1="28" y1="10" x2="20" y2="2" stroke="#1a0f06" stroke-width="2" stroke-linecap="round"/>
          <line x1="36" y1="10" x2="44" y2="2" stroke="#1a0f06" stroke-width="2" stroke-linecap="round"/>
          <circle cx="29" cy="15" r="1.6" fill="#f5b400"/>
          <circle cx="35" cy="15" r="1.6" fill="#f5b400"/>
        </svg>`;
    }

    function createHoles(count = 12) {
      for (let i = 0; i < count; i++) {
        const hole = document.createElement('div');
        hole.className = 'hole';
        hole.style.left = (10 + Math.random() * 80) + '%';
        hole.style.top  = (15 + Math.random() * 70) + '%';
        bugsField.appendChild(hole);
      }
    }

    function spawnBug() {
      if (!bugActive) return;

      const bug = document.createElement('div');
      bug.className = 'bug';

      const color = BUG_COLORS[Math.floor(Math.random() * BUG_COLORS.length)];
      bug.innerHTML = bugSVG(color);

      const x = 8 + Math.random() * 84;
      const y = 12 + Math.random() * 76;
      bug.style.left = x + '%';
      bug.style.top  = y + '%';

      const scale  = 0.7 + Math.random() * 0.7;
      const rotate = -30 + Math.random() * 60;

      bug.style.transform = `translate(-50%, -50%) scale(0) rotate(${rotate}deg)`;
      bugsField.appendChild(bug);

      requestAnimationFrame(() => {
        bug.classList.add('show');
        bug.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${rotate}deg)`;
      });

      const lifetime = 600 + Math.random() * 1000;

      const hideTimeout = setTimeout(() => {
        if (bug.classList.contains('hit')) return;
        bug.style.transition = 'transform .2s, opacity .2s';
        bug.style.transform = `translate(-50%, -50%) scale(0) rotate(${rotate}deg)`;
        bug.style.opacity = '0';
        setTimeout(() => bug.remove(), 250);
      }, lifetime);

      bug.addEventListener('click', e => {
        e.stopPropagation();
        if (!bug.classList.contains('show') || bug.classList.contains('hit')) return;
        clearTimeout(hideTimeout);

        bug.classList.add('hit');
        bugScore++;
        bugsScoreEl.textContent = bugScore;

        const pop = document.createElement('div');
        pop.className = 'pop';
        pop.textContent = '+1';
        pop.style.left = x + '%';
        pop.style.top  = y + '%';
        bugsField.appendChild(pop);
        setTimeout(() => pop.remove(), 800);

        setTimeout(() => bug.remove(), 200);
      });
    }

    bugsField.addEventListener('click', e => {
      if (!bugActive) return;
      if (e.target.closest('.bug')) return;
      if (e.target.closest('.game-over')) return;

      const pop = document.createElement('div');
      pop.className = 'miss-pop';
      pop.textContent = 'мимо';
      const rect = bugsField.getBoundingClientRect();
      pop.style.left = ((e.clientX - rect.left) / rect.width  * 100) + '%';
      pop.style.top  = ((e.clientY - rect.top ) / rect.height * 100) + '%';
      bugsField.appendChild(pop);
      setTimeout(() => pop.remove(), 600);
    });

    function scheduleSpawn() {
      if (!bugActive) return;
      const delay = 200 + Math.random() * 500;

      bugSpawnTimer = setTimeout(() => {
        const r = Math.random();
        let count = 1;
        if (r > 0.85) count = 3;
        else if (r > 0.6) count = 2;

        for (let i = 0; i < count; i++) {
          setTimeout(spawnBug, i * (60 + Math.random() * 120));
        }
        scheduleSpawn();
      }, delay);
    }

    function startCountdown() {
      bugsTimeEl.classList.remove('warn');
      bugCountdownTimer = setInterval(() => {
        bugTimeLeft--;
        bugsTimeEl.textContent = bugTimeLeft;
        if (bugTimeLeft <= 5) bugsTimeEl.classList.add('warn');
        if (bugTimeLeft <= 0) endBugGame();
      }, 1000);
    }

    function startBugGame() {
      bugsStart.classList.add('hidden');
      bugsArea.classList.remove('hidden');

      bugsOver.classList.remove('visible');
      bugScore = 0;
      bugTimeLeft = 30;
      bugActive = true;
      bugsScoreEl.textContent = '0';
      bugsTimeEl.textContent = '30';
      bugsTimeEl.classList.remove('warn');

      bugsField.querySelectorAll('.bug, .hole, .pop, .miss-pop')
        .forEach(el => el.remove());

      createHoles(12);
      scheduleSpawn();
      startCountdown();
    }

    function endBugGame() {
      bugActive = false;
      clearInterval(bugCountdownTimer);
      clearTimeout(bugSpawnTimer);

      bugsField.querySelectorAll('.bug').forEach(b => b.remove());

      let verdict = '';
      if (bugScore === 0)      verdict = 'Улитка бы справилась лучше...';
      else if (bugScore < 10)  verdict = 'Начало положено, тренируйся!';
      else if (bugScore < 20)  verdict = 'Хороший результат!';
      else if (bugScore < 35)  verdict = 'Ты — гроза жуков!';
      else                     verdict = 'Настоящий энтомолог!';

      bugsFinalScore.textContent = bugScore;
      bugsVerdict.textContent = verdict;
      bugsOver.classList.add('visible');
    }

    function backBugGame() {
      bugActive = false;
      clearInterval(bugCountdownTimer);
      clearTimeout(bugSpawnTimer);
      bugsField.querySelectorAll('.bug, .hole, .pop, .miss-pop')
        .forEach(el => el.remove());

      bugsOver.classList.remove('visible');
      bugsArea.classList.add('hidden');
      bugsStart.classList.remove('hidden');
    }

    bugsStartBtn.addEventListener('click', startBugGame);
    bugsAgainBtn.addEventListener('click', startBugGame);
    bugsBackBtn.addEventListener('click', backBugGame);
  }

  /* =========================================================
     4. ИГРА «ПАЗЛ — ПЯТНАШКИ 3×3»
     ========================================================= */
  const PUZZLE_KEY = 'tractorPuzzleBest';

  const puzzleStart      = document.getElementById('puzzleStart');
  const puzzleArea       = document.getElementById('puzzleArea');
  const puzzleGrid       = document.getElementById('puzzleGrid');
  const puzzleMovesEl    = document.getElementById('puzzleMoves');
  const puzzleTimeEl     = document.getElementById('puzzleTime');
  const puzzleWin        = document.getElementById('puzzleWin');
  const puzzleFinalMoves = document.getElementById('puzzleFinalMoves');
  const puzzleFinalTime  = document.getElementById('puzzleFinalTime');
  const puzzleStartBtn   = document.getElementById('puzzleStartBtn');
  const puzzleShuffleBtn = document.getElementById('puzzleShuffle');
  const puzzleAgainBtn   = document.getElementById('puzzleAgain');
  const puzzleBackBtn    = document.getElementById('puzzleBack');

  if (puzzleGrid) {
    let tiles = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    let moves = 0;
    let startTime = 0;
    let timerInterval = null;
    let puzzleActive = false;
    let solved = false;

    function isSolved() {
      for (let i = 0; i < 8; i++) {
        if (tiles[i] !== i + 1) return false;
      }
      return tiles[8] === 0;
    }

    function renderPuzzle() {
      puzzleGrid.innerHTML = '';
      const emptyIdx = tiles.indexOf(0);

      tiles.forEach((val, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'puzzle-tile';
        if (val === 0) {
          btn.classList.add('empty');
          btn.textContent = '';
          btn.disabled = true;
        } else {
          btn.textContent = val;
          const row = Math.floor(i / 3), col = i % 3;
          const eRow = Math.floor(emptyIdx / 3), eCol = emptyIdx % 3;
          const adjacent =
            (Math.abs(row - eRow) === 1 && col === eCol) ||
            (Math.abs(col - eCol) === 1 && row === eRow);

          if (adjacent && puzzleActive && !solved) {
            btn.classList.add('movable');
          }
          if (solved) btn.classList.add('solved');

          btn.addEventListener('click', () => tryMove(i));
        }
        puzzleGrid.appendChild(btn);
      });
    }

    function tryMove(idx) {
      if (!puzzleActive || solved) return;
      const emptyIdx = tiles.indexOf(0);

      const row = Math.floor(idx / 3), col = idx % 3;
      const eRow = Math.floor(emptyIdx / 3), eCol = emptyIdx % 3;

      const adjacent =
        (Math.abs(row - eRow) === 1 && col === eCol) ||
        (Math.abs(col - eCol) === 1 && row === eRow);

      if (!adjacent) return;

      [tiles[idx], tiles[emptyIdx]] = [tiles[emptyIdx], tiles[idx]];
      moves++;
      puzzleMovesEl.textContent = moves;
      renderPuzzle();

      if (isSolved()) winPuzzle();
    }

    function formatTime(ms) {
      const total = Math.floor(ms / 1000);
      const m = String(Math.floor(total / 60)).padStart(2, '0');
      const s = String(total % 60).padStart(2, '0');
      return m + ':' + s;
    }

    function startTimer() {
      startTime = Date.now();
      puzzleTimeEl.textContent = '00:00';
      clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        puzzleTimeEl.textContent = formatTime(Date.now() - startTime);
      }, 250);
    }

    function shuffleTiles() {
      tiles = [1, 2, 3, 4, 5, 6, 7, 8, 0];
      for (let k = 0; k < 120; k++) {
        const emptyIdx = tiles.indexOf(0);
        const row = Math.floor(emptyIdx / 3), col = emptyIdx % 3;
        const neighbors = [];
        if (row > 0) neighbors.push(emptyIdx - 3);
        if (row < 2) neighbors.push(emptyIdx + 3);
        if (col > 0) neighbors.push(emptyIdx - 1);
        if (col < 2) neighbors.push(emptyIdx + 1);

        const pick = neighbors[Math.floor(Math.random() * neighbors.length)];
        [tiles[pick], tiles[emptyIdx]] = [tiles[emptyIdx], tiles[pick]];
      }
      if (isSolved()) shuffleTiles();
    }

    function startPuzzle() {
      puzzleStart.classList.add('hidden');
      puzzleArea.classList.remove('hidden');
      puzzleWin.classList.remove('visible');

      solved = false;
      puzzleActive = true;
      moves = 0;
      puzzleMovesEl.textContent = '0';

      shuffleTiles();
      renderPuzzle();
      startTimer();
    }

    function winPuzzle() {
      solved = true;
      puzzleActive = false;
      clearInterval(timerInterval);

      const elapsed = Date.now() - startTime;
      puzzleFinalMoves.textContent = moves;
      puzzleFinalTime.textContent = 'Время: ' + formatTime(elapsed);

      const best = parseInt(localStorage.getItem(PUZZLE_KEY) || '0', 10);
      if (!best || moves < best) {
        localStorage.setItem(PUZZLE_KEY, String(moves));
      }

      renderPuzzle();
      setTimeout(() => puzzleWin.classList.add('visible'), 350);
    }

    function reshufflePuzzle() {
      if (!puzzleActive) return;
      moves = 0;
      puzzleMovesEl.textContent = '0';
      puzzleWin.classList.remove('visible');
      solved = false;
      shuffleTiles();
      renderPuzzle();
      startTimer();
    }

    function backPuzzle() {
      puzzleActive = false;
      solved = false;
      clearInterval(timerInterval);
      puzzleWin.classList.remove('visible');
      puzzleArea.classList.add('hidden');
      puzzleStart.classList.remove('hidden');
    }

    puzzleStartBtn.addEventListener('click', startPuzzle);
    puzzleShuffleBtn.addEventListener('click', reshufflePuzzle);
    puzzleAgainBtn.addEventListener('click', startPuzzle);
    puzzleBackBtn.addEventListener('click', backPuzzle);
  }

});