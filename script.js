// Leave limits for each course
const leaveLimits = {
    เคมี: 12,
    ดาราศาสตร์: 8,
    ชีวะ: 12,
    ฟิสิกส์: 16,
    คณิตศาสตร์: 99999,
    english_Lolie: 12,
    ภาษาไทย: 8,
    คอมพิวเตอร์: 4,
    สุขศึกษา: 4,
    ศิลปะ: 4,
    english_Waranya: 8,
    english_Teacher: 4,
    ห้องสมุด: 4,
    เกษตร: 4,
    สังคม: 8,
    แนะแแนว: 4
};

// Tracker for the number of leaves taken for each course
const leaveCounts = {};

// Initialize leaveCounts from Local Storage
function initializeLeaveCounts() {
    const storedCounts = localStorage.getItem('leaveCounts');
    if (storedCounts) {
        Object.assign(leaveCounts, JSON.parse(storedCounts));
    } else {
        for (const course in leaveLimits) {
            leaveCounts[course] = 0; // Default to 0 if no data
        }
    }
}

// Course deductions by day
const dailyDeductions = {
    จันทร์: { เคมี: 2, สุขศึกษา: 1, english_Waranya: 1, ศิลปะ: 1, ภาษาไทย: 1, สังคม: 1 },
    อังคาร: { english_Waranya: 1, เคมี: 1, ดาราศาสตร์: 2, ชีวะ: 1, สังคม: 1, คณิตศาสตร์: 1 },
    พุธ: { ฟิสิกส์: 2, คณิตศาสตร์: 1, เกษตร: 1, english_Teacher: 1, ห้องสมุด: 1 },
    พฤหัสบดี: { แนะแแนว: 1, คอมพิวเตอร์: 1, ฟิสิกส์: 2, คณิตศาสตร์: 1, english_Lolie: 2},
    ศุกร์: { ชีวะ: 2, ภาษาไทย: 1, english_Lolie: 1 }
};

// Function to update the summary section
function updateSummary() {
    const summaryList = document.getElementById("summary-list");
    summaryList.innerHTML = ""; // Clear existing summary

    for (let course in leaveLimits) {
        const remainingLeaves = leaveLimits[course] - (leaveCounts[course] || 0); // Use 0 if undefined
        
        const summaryItem = document.createElement("li");
        summaryItem.textContent = `${course}: ${remainingLeaves} ครั้งที่สามารถลาได้`;
        
        summaryList.appendChild(summaryItem);
    }

    // Update Local Storage
    localStorage.setItem('leaveCounts', JSON.stringify(leaveCounts));
}

// Function to add leave for the selected day
function addLeaveForSelectedDay() {
    const selectedDay = document.getElementById("leave-day").value;

    if (selectedDay && dailyDeductions[selectedDay]) {
        // Check if any course has reached its leave limit for the selected day
        let canDeductLeaves = true;

        for (let course in dailyDeductions[selectedDay]) {
            const deduction = dailyDeductions[selectedDay][course];
            if (leaveCounts[course] !== undefined && leaveCounts[course] + deduction > leaveLimits[course]) {
                canDeductLeaves = false; // At least one course has reached its limit
                break; // No need to check further
            }
        }

        if (canDeductLeaves) {
            // If all courses can deduct leaves, proceed with the deductions
            for (let course in dailyDeductions[selectedDay]) {
                const deduction = dailyDeductions[selectedDay][course];
                leaveCounts[course] = (leaveCounts[course] || 0) + deduction; // Use 0 if undefined

                const listItem = document.createElement("li");
                listItem.textContent = `วิชา: ${course}, วัน: ${selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)} (ลาไปแล้ว: ${leaveCounts[course]} / ${leaveLimits[course]})`;

                document.getElementById("leave-list").appendChild(listItem);
            }

            updateSummary();
        } else {
            alert("มี 1 หรือมากกว่า 1 วิชาที่วันหยุดครบแล้ว ถ้ามึงจะหยุดก็ติด มส. แล้วแต่ละกัน");
        }
    } else {
        alert("Please select a valid day!");
    }
}

// Function to add leave for the selected course
function addLeaveForSelectedCourse() {
    const selectedCourse = document.getElementById("course").value;

    if (selectedCourse) {
        if (leaveCounts[selectedCourse] < leaveLimits[selectedCourse]) {
            leaveCounts[selectedCourse] += 1;

            const listItem = document.createElement("li");
            listItem.textContent = `วิชา: ${selectedCourse} (ลาไปแล้ว: ${leaveCounts[selectedCourse]} / ${leaveLimits[selectedCourse]})`;
            
            document.getElementById("leave-list").appendChild(listItem);
            updateSummary();
        } else {
            alert(`วันหยุดครบแล้วสำหรับวิชา ${selectedCourse}. หยุดไม่ได้แล้วนะจ้ะ มาเรียนๆ`);
        }
    } else {
        alert("Please select a valid course!");
    }
}

// Function to reset leave counts
function resetLeaveCounts() {
    for (const course in leaveCounts) {
        leaveCounts[course] = 0; // Reset each course's leave count to 0
    }

    updateSummary(); // Update the summary after resetting
    document.getElementById("leave-list").innerHTML = ""; // Clear the leave tracker list
}

// Event listeners for buttons
document.getElementById("add-leave-day").addEventListener("click", addLeaveForSelectedDay);
document.getElementById("add-leave-course").addEventListener("click", addLeaveForSelectedCourse);

// Event listener for the reset button
document.getElementById("reset-leave").addEventListener("click", function() {
    if (confirm("นี่คือการรีเซ็ทจำนวนการลา และไม่สามารถย้อนกลับได้ แน่ใจไหม?")) {
        resetLeaveCounts();
    }
});

// Initialize leave counts on page load
initializeLeaveCounts();
updateSummary();
