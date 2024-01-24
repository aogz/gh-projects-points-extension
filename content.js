document.onkeydown = function (e) {
  if (e.ctrlKey && e.altKey && e.key === "p") {
    console.log("Calculating points...");
    const tableGroups = document.querySelectorAll('[data-testid^="table-group-"][role="rowgroup"]');
    
    let totalSumPoints = 0;
    let totalPendingPoints = 0;
    let totalCompletedPoints = 0;
    for (const tableGroup of tableGroups) {
      const tableGroupHeader = tableGroup.querySelector('[data-testid^="group-header-"]');
      console.log('tableGroupHeader', tableGroupHeader);
      const tableGroupRows = tableGroup.querySelectorAll('[role="row"]');
      console.log('tableGroupRows', tableGroupRows);
      
      let totalPoints = 0
      let completedPoints = 0
      for (const row of tableGroupRows) {
        const rowIdRegex = /TableRow{(\w)+: (.*)}/;
        const rowIdMatch = row.getAttribute("data-testid").match(rowIdRegex);
        if (rowIdMatch) {
          const rowId = rowIdMatch[2];
          const pointsCoulmn = `[data-testid="TableCell{row: ${rowId}, column: Points}"]`
          const isCompleted = row.querySelector('[aria-label="Closed as completed issue"]') || row.querySelector('[aria-label="Merged pull request"]');
          const rowPoints = parseInt(row.querySelector(pointsCoulmn).innerText) || 0
          totalPoints += rowPoints;
          completedPoints += isCompleted ? rowPoints : 0;
        }
      }
      
      if (tableGroupHeader) {
        const pointsLabelClass = "points-label"
        const existingLabels = tableGroupHeader.querySelectorAll(`.${pointsLabelClass}`)
        for (const existingLabel of existingLabels) {
          existingLabel.remove()
        }
        
        const itemsCounter = tableGroupHeader.querySelector('[data-testid="column-items-counter"]')
        const pointsLabel = document.createElement('span');
        const percentage = Math.round((completedPoints / totalPoints) * 100);
        pointsLabel.innerText = `Points: ${completedPoints}/${totalPoints} (${percentage}%)`;
        for (const klass of itemsCounter.classList) {
          pointsLabel.classList.add(klass);
        }
        pointsLabel.classList.add(pointsLabelClass);
        itemsCounter.parentNode.appendChild(pointsLabel);
      }
      
      totalSumPoints += totalPoints;
      totalPendingPoints += totalPoints - completedPoints;
      totalCompletedPoints += completedPoints;
    }
    
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    popup.style.borderRadius = '12px';
    popup.style.opacity = '0.8';
    popup.style.color = 'white';
    popup.style.fontSize = '24px';
    popup.style.padding = '16px';
    popup.innerHTML = `Total points: ${totalSumPoints}<br/>Completed points: ${totalCompletedPoints}<br/>Pending Points: ${totalPendingPoints}<br/>Percentage: ${Math.round((totalCompletedPoints / totalSumPoints) * 100)}%`;
    document.body.appendChild(popup);
    
    setTimeout(() => {
      popup.remove();
    }, 3000);
  }
};

