setTimeout(()=>{
    const success = document.getElementById('success');
    const error = document.getElementById('error');
    if(success){
        success.style.display = 'none';
    }
    if(error){
        error.style.display = 'none';
    }
}, 3000);