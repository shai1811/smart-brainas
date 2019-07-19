import React from 'react';

const Navigation = ({ onRouteChange, isSignedIn }) => {
		if(isSignedIn) {
			return(
		<nav style={{display: 'flex', justifyContent: 'flex-end'}}> {/*bring the sign out to the right*/}
			<p onClick={() => onRouteChange('signout')} className='f3 link din black underline pa3 pointer'>Sign Out</p> {/* the tachyons give the option to make the style in the classname*/}
		</nav>
		);
	} else {
		return(
		<nav style={{display: 'flex', justifyContent: 'flex-end'}}> {/*bring the sign out to the right*/}
			<p onClick={() => onRouteChange('signin')} className='f3 link din black underline pa3 pointer'>Sign In</p> {/* the tachyons give the option to make the style in the classname*/}
			<p onClick={() => onRouteChange('register')} className='f3 link din black underline pa3 pointer'>Register</p> {/* the tachyons give the option to make the style in the classname*/}
		</nav>
		);
	}
}

export default Navigation;