import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import goalService from "./goalService";

const initialState = {
    goals: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
}

// Set Goal
export const setGoal = createAsyncThunk('goals/create', async (goal, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await goalService.setGoal(goal, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// Get user goals
export const getGoals = createAsyncThunk(
    'goals/getAll',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await goalService.getGoals(token)
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

// Delete user goal
export const deleteGoal = createAsyncThunk(
    'goals/delete',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await goalService.deleteGoal(id, token)
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const goalSlice = createSlice({
    name: 'goal',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false
            state.isError = false
            state.isSuccess = false
            state.message = ''
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(setGoal.pending, (state) => {
                state.isLoading = true
            })
            .addCase(setGoal.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.goals.push(action.payload)
            })
            .addCase(setGoal.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getGoals.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getGoals.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.goals = action.payload
            })
            .addCase(getGoals.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(deleteGoal.pending, (state) => {
                state.isLoading = true
            })
            .addCase(deleteGoal.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.goals = state.goals.filter(
                    (goal) => goal._id !== action.payload.id
                )
            })
            .addCase(deleteGoal.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    }
})

export const { reset } = goalSlice.actions
export default goalSlice.reducer