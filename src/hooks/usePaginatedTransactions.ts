import { useCallback, useState } from "react"
import { PaginatedRequestParams, PaginatedResponse, Transaction } from "../utils/types"
import { PaginatedTransactionsResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"

// /**
//  *
//  * Bug #4 Fixed by changing the return on setPaginatedTransactions.
//  * By using the spread operator the object is flattened and can be merged
//  * May have fixed bug#7 too
//  *
//  */
export function usePaginatedTransactions(): PaginatedTransactionsResult {
  const { fetchWithCache, loading } = useCustomFetch()
  const [paginatedTransactions, setPaginatedTransactions] = useState<PaginatedResponse<
    Transaction[]
  > | null>(null)

  const fetchAll = useCallback(async () => {
    const response = await fetchWithCache<PaginatedResponse<Transaction[]>, PaginatedRequestParams>(
      "paginatedTransactions",
      {
        page: paginatedTransactions === null ? 0 : paginatedTransactions.nextPage,
      }
    )

    setPaginatedTransactions((previousResponse) => {
      if (response === null || previousResponse === null) {
        return response
      }

      return {
        data: [...previousResponse.data, ...response.data], // add new data to existing data
        nextPage: response.nextPage,
      }
    })
  }, [fetchWithCache, paginatedTransactions])

  const invalidateData = useCallback(() => {
    setPaginatedTransactions(null)
  }, [])

  return { data: paginatedTransactions, loading, fetchAll, invalidateData }
}

// In this updated code, the fetchAll function first checks if paginatedTransactions is null or if it has a valid nextPage value. If it is null, then page is set to 0. Otherwise, page is set to the nextPage value of paginatedTransactions. This way, the API request will always be made with a valid page value, even if the initial state of paginatedTransactions is null.

// Additionally, if a null value is returned from the API, the setPaginatedTransactions function will not be called, and the state will not be updated. This ensures that the component state remains the same if a null value is received from the API.

// export function usePaginatedTransactions(): PaginatedTransactionsResult {
//   const { fetchWithCache, loading } = useCustomFetch()
//   const [paginatedTransactions, setPaginatedTransactions] = useState<PaginatedResponse<
//     Transaction[]
//   > | null>(null)

//   const fetchAll = useCallback(async () => {
//     let page = 0
//     if (paginatedTransactions !== null && paginatedTransactions.nextPage) {
//       page = paginatedTransactions.nextPage
//     }

//     const response = await fetchWithCache<PaginatedResponse<Transaction[]>, PaginatedRequestParams>(
//       "paginatedTransactions",
//       {
//         page: page,
//       }
//     )

//     setPaginatedTransactions((previousResponse) => {
//       if (response === null || previousResponse === null) {
//         return response
//       }

//       return {
//         data: [...previousResponse.data, ...response.data], // add new data to existing data
//         nextPage: response.nextPage,
//       }
//     })
//   }, [fetchWithCache, paginatedTransactions])

//   const invalidateData = useCallback(() => {
//     setPaginatedTransactions(null)
//   }, [])

//   return { data: paginatedTransactions, loading, fetchAll, invalidateData }
// }
