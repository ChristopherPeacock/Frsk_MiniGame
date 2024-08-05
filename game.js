document.addEventListener('DOMContentLoaded', function(){

    const container = document.querySelector('game-container');
    const button = document.getElementById('prompt');
    const frame = document.getElementById('slider-frame');
    const slider = document.getElementById('slider');
    const target = document.getElementById('rectangle-5');
    
    let idSlider = null;
    
    
    // Check and handle collision
    const detectAndHandleCollision = () => {

        // sliders frame position
        const box = frame.getBoundingClientRect()
        const bL = box.left
        const bR = box.right
        const bT = box.top
        const bB = box.bottom
        console.log(bL, bR, bT, bB)

        // Update slider's position
        const rect = slider.getBoundingClientRect();
        const sL = rect.left;
        const sR = rect.right;
        const sT = rect.top;
        const sB = rect.bottom;
        // console.log(sL, sR, sT, sB)
    
        // Update target's position
        const goal = target.getBoundingClientRect();
        const tL = goal.left;
        const tR = goal.right;
        const tT = goal.top;
        const tB = goal.bottom;
        // console.log(tL, tR, tT, tB)
    
        if (sR >= bR && sR >= bR && sB >= bT && sT <= bB) {
            slider.classList.add('colliding');
            target.classList.add('colliding');
            console.log('collided');
            return true;
        } else {
            slider.classList.remove('colliding');
            target.classList.remove('colliding');
            // console.log('not colliding');
            return false;
        }
    }
    
    const moveSlider = () => {
        let pos = 0;
        clearInterval(idSlider);
        idSlider = setInterval(() => {
            // Update the slider's position
            slider.style.left = pos + 'px';
            // Check for collision
            if (detectAndHandleCollision()) {
                // console.log('Collision detected, stopping movement');
                clearInterval(idSlider);
                alert('Game Over');
            } else {
                pos++;
                // console.log('Position:', pos);
            }
        }, 10);
    }

    const moveTarget = () => {
        
        const box = frame.getBoundingClientRect()
        const minLeft = box.left
        const maxRight = box.right

        const RightPos = Math.floor(Math.random() * (maxRight + 1))
        const leftPos = Math.floor(Math.random())
        

       

        
        

        
            
    }
    
    

    moveTarget()
    moveSlider();
    
        

       
       






      
        

     
        
        
    




   
})