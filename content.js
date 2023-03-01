document.onkeydown = function (e) {
  if (e.ctrlKey && e.altKey && e.key === "p") {
    console.log("Calculating points...");
    const tableGroups = document.querySelectorAll('[data-test-id^="table-group-"][role="rowgroup"]');

    for (const tableGroup of tableGroups) {
      const tableGroupHeader = tableGroup.querySelector('[data-test-id^="table-group-header-"]');
      const tableGroupRows = tableGroup.querySelectorAll('[role="row"]');

      let totalPoints = 0
      let completedPoints = 0
      for (const row of tableGroupRows) {
        const rowIdRegex = /TableRow{id: (.*)}/;
        const rowIdMatch = row.getAttribute("data-test-id").match(rowIdRegex);
        if (rowIdMatch) {
          const rowId = rowIdMatch[1];
          const pointsCoulmn = `[data-test-id="TableCell{row: ${rowId}, column: Points}"]`
          const isCompleted = row.querySelector('[aria-label="Closed as completed issue"]');
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

        const itemsCounter = tableGroupHeader.querySelector('[data-test-id="column-items-counter"]')
        const pointsLabel = document.createElement('span');
        pointsLabel.innerText = `Points: ${completedPoints}/${totalPoints}`;
        for (const klass of itemsCounter.classList) {
          pointsLabel.classList.add(klass);
        }
        pointsLabel.classList.add(pointsLabelClass);
        itemsCounter.parentNode.appendChild(pointsLabel);
      }
    }
  }
};
