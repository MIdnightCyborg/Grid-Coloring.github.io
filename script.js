document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const colorPicker = document.getElementById('colorPicker');
    const selectedColor = document.getElementById('selectedColor');
    const clearGridBtn = document.getElementById('clearGrid');
    const undoBtn = document.getElementById('undo');
    const redoBtn = document.getElementById('redo');
    const blockSizeInput = document.getElementById('blockSize');
    const gridSizeInput = document.getElementById('gridSize');
    const backgroundMusic = document.getElementById('backgroundMusic');

    let history = [];
    let redoStack = [];
    let gridSize = parseInt(gridSizeInput.value);
    let blockSize = parseInt(blockSizeInput.value);

    // Play background music
    backgroundMusic.volume = 0.5; // Adjust volume if needed
    backgroundMusic.play();

    const createGrid = () => {
        grid.innerHTML = '';
        grid.style.gridTemplateColumns = `repeat(${gridSize}, ${blockSize}px)`;
        grid.style.gridTemplateRows = `repeat(${gridSize}, ${blockSize}px)`;

        for (let i = 0; i < gridSize * gridSize; i++) {
            const cell = document.createElement('div');
            cell.addEventListener('click', () => {
                const previousColor = cell.style.backgroundColor;
                cell.style.backgroundColor = colorPicker.value;
                cell.classList.add('color-change');
                setTimeout(() => cell.classList.remove('color-change'), 300);
                history.push({ cell, previousColor });
                redoStack = []; // Clear redo stack on new action
            });
            grid.appendChild(cell);
        }
    };

    const updateGridSize = () => {
        gridSize = parseInt(gridSizeInput.value);
        createGrid();
    };

    const updateBlockSize = () => {
        blockSize = parseInt(blockSizeInput.value);
        createGrid();
    };

    const clearGrid = () => {
        grid.querySelectorAll('div').forEach(cell => {
            cell.classList.add('fade-out');
            setTimeout(() => cell.style.backgroundColor = 'white', 300);
            setTimeout(() => cell.classList.remove('fade-out'), 300);
        });
        history = [];
        redoStack = [];
    };

    const undo = () => {
        if (history.length > 0) {
            const lastAction = history.pop();
            redoStack.push(lastAction);
            lastAction.cell.classList.add('color-change');
            lastAction.cell.style.backgroundColor = lastAction.previousColor;
            setTimeout(() => lastAction.cell.classList.remove('color-change'), 300);
        }
    };

    const redo = () => {
        if (redoStack.length > 0) {
            const lastUndo = redoStack.pop();
            lastUndo.cell.classList.add('color-change');
            lastUndo.cell.style.backgroundColor = colorPicker.value;
            history.push({ cell: lastUndo.cell, previousColor: lastUndo.cell.style.backgroundColor });
            setTimeout(() => lastUndo.cell.classList.remove('color-change'), 300);
        }
    };

    colorPicker.addEventListener('input', () => {
        selectedColor.textContent = colorPicker.value;
        selectedColor.style.color = colorPicker.value;
    });

    clearGridBtn.addEventListener('click', clearGrid);
    undoBtn.addEventListener('click', undo);
    redoBtn.addEventListener('click', redo);
    blockSizeInput.addEventListener('input', updateBlockSize);
    gridSizeInput.addEventListener('input', updateGridSize);

    createGrid(); // Initialize grid
});
