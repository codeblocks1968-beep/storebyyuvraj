document.addEventListener('DOMContentLoaded', () => {
    const wheelMain = document.getElementById('wheel-main');
    const spinTrigger = document.getElementById('spin-trigger');
    const spinBtn = document.getElementById('btn-spin-now');
    const claimBtn = document.getElementById('btn-claim-reward');
    const wheelIntro = document.getElementById('wheel-intro');
    const wheelReward = document.getElementById('wheel-reward');
    const rewardMessage = document.getElementById('reward-message');
    const rewardCodeText = document.getElementById('reward-code-text');

    const STORAGE_KEY = 'gaming_hub_wheel_reward';
    
    // Check if user has already won something
    const savedReward = localStorage.getItem(STORAGE_KEY);
    if (savedReward) {
        const rewardData = JSON.parse(savedReward);
        showReward(rewardData.result, rewardData.code);
    }

    let isSpinning = false;

    function showReward(result, code) {
        if (wheelIntro) wheelIntro.style.display = 'none';
        if (wheelReward) wheelReward.style.display = 'block';
        
        if (code === 'TRYAGAIN') {
            rewardMessage.textContent = "So close! But no offer this time.";
            rewardCodeText.style.display = 'none';
            if (claimBtn) claimBtn.textContent = "Return to Store";
        } else {
            rewardMessage.textContent = `Congratulations! You unlocked ${result}!`;
            rewardCodeText.textContent = code;
        }
    }

    const spin = () => {
        if (isSpinning || localStorage.getItem(STORAGE_KEY)) return;
        isSpinning = true;

        // Random rotation between 2000 and 5000 degrees
        const randomRotation = Math.floor(2000 + Math.random() * 3000);
        wheelMain.style.transform = `rotate(${randomRotation}deg)`;

        // Calculate result after animation
        setTimeout(() => {
            const actualRotation = randomRotation % 360;
            let result = '';
            let code = '';

            const pointerPos = (360 - actualRotation) % 360;

            if (pointerPos >= 0 && pointerPos < 90) {
                result = '50% OFF';
                code = 'GAMING50';
            } else if (pointerPos >= 90 && pointerPos < 180) {
                result = '10% OFF';
                code = 'SAVE10';
            } else if (pointerPos >= 180 && pointerPos < 270) {
                result = 'BUY 1 GET 1 FREE';
                code = 'BOGO';
            } else {
                result = 'Better luck next time!';
                code = 'TRYAGAIN';
            }

            // Save reward
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ result, code }));

            showReward(result, code);
            isSpinning = false;
        }, 5000);
    };

    if (spinTrigger) spinTrigger.addEventListener('click', spin);
    if (spinBtn) spinBtn.addEventListener('click', spin);

    if (claimBtn) {
        claimBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    // Copy code to clipboard
    if (rewardCodeText) {
        rewardCodeText.addEventListener('click', () => {
            const code = rewardCodeText.textContent;
            navigator.clipboard.writeText(code).then(() => {
                const originalText = rewardCodeText.textContent;
                rewardCodeText.textContent = 'COPIED!';
                rewardCodeText.style.borderColor = 'var(--neon-green)';
                setTimeout(() => {
                    rewardCodeText.textContent = originalText;
                    rewardCodeText.style.borderColor = 'var(--neon-blue)';
                }, 2000);
            });
        });
        
        rewardCodeText.style.cursor = 'pointer';
        rewardCodeText.title = 'Click to copy';
    }
});
