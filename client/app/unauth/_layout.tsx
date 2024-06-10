import React from 'react'
import { Stack } from 'expo-router'

export default function UnauthLayout() {
    return (
        <Stack>
            <Stack.Screen name='login' />
            <Stack.Screen name='register' />
        </Stack>
    )
}
