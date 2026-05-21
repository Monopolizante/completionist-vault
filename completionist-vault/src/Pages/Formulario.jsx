import "./pages.css"

function Formulario (){
    return(
        <>
            <div className={"form-container"}>
                <form className={"form"}>
                    <p className={"form-title"}>Enter your account</p>
                    <div className={"input-container"}>
                        <input type="email" placeholder='Enter email:' />
                        <span></span>
                    </div>
                    <div className={"input-container"}>
                        <input type="password" placeholder='Enter password:' />
                    </div>
                    <button type="submit" className={"submit"}>
                        Enter
                    </button>

                    <p className='signup-link'>
                        No have account?
                        <a href="">Sign up</a>
                    </p>

                </form>

            </div>
            
        </>
    )
}
export default Formulario