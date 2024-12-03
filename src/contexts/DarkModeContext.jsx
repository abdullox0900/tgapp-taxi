import React, { createContext, useContext, useEffect, useState } from 'react'

// Dark mode konteksti
const DarkModeContext = createContext()

// Dark mode provider
export const DarkModeProvider = ({ children }) => {
	const [isDarkMode, setIsDarkMode] = useState(false)

	useEffect(() => {
		// Telegram WebApp dan dark mode ni aniqlash
		const tg = window.Telegram?.WebApp
		if (tg) {
			setIsDarkMode(tg.colorScheme === 'dark')
		}
	}, [])

	return (
		<DarkModeContext.Provider value={isDarkMode}>
			{children}
		</DarkModeContext.Provider>
	)
}

// Dark mode kontekstini olish
export const useDarkMode = () => {
	return useContext(DarkModeContext)
}
