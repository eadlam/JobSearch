**The Muse: Job Search**

This app uses ReactJS and a barebones implementation of flux (using RxJS as the dispatcher) to provide basic job browsing for jobs at **themuse.com**.

The notable features are that it indexes job attributes as new jobs are loaded (in the IndexStore), it caches job data and search results in memory (in the JobStore), and it caches company data in memory (in the CompanyStore).  

To install dependencies:
```
> npm install
```

To run the dev server:
```
> npm start
```

To build:
```
> npm run build
```

**Design Constraints**

Some notable features about the jobs API are:

1. It doesn’t support keyword search
2. Values for filterable fields (Company, Category, Level, and Location) must be spelled correctly including case and inclusion of non-alphanumeric symbols (e.g. “Stockholm, Sweden”)
3. The “rank” used to sort jobs is not included as a field in the job object. jobs are “intelligently sorted by a number of factors such as trendiness, uniqueness, newness”

To address the first two points, the UI should provide option menus rather than search boxes for filtering jobs by each search field (otherwise the user wouldn’t know what to type). Alternatively, a search box could be used to filter the option menus (search suggest), which emulates keyword search to a large extent. Both options require an index of all the valid values. 

**Indexing**

A full fledged search app would need to poll the API periodically to build, and keep current, an index of all valid values for the filterable job attributes. It might also index words in the job descriptions to provide keyword search.

I chose not to pre-index all the jobs, because that would result in an app that doesn’t use the search API very much. As a compromise, I chose to dynamically index the attributes on the client side as new jobs are loaded. This makes for a somewhat strange UX, but hopefully a good demonstration. Due to time constraints, I’ve only indexed the Company names. 

The result is a UI that starts by loading page 0 with no filters, and indexes all companies on that page. Incrementing the page results in the app indexing more companies. Selecting one or more companies from the resulting menu performs a new search filtered by those companies. 

Additionally, for each job, I also query the /**companies/:id** endpoint so that I could include company details in the job descriptions (mainly logos and images).

**Caching**

To avoid unnecessary API calls, I cache the company details, and job searches, in memory. When each job is loaded, it tries to fetch the company details from the CompanyStore. If the company is not in the store, it queries the API. 

Caching the jobs is somewhat more complicated. Since the ordering is based on an implicit rank which isn’t encoded as a value in the job data, I created an index of the search results, where the index key is a serialization of the search parameters and the value is an array of job ID’s. If a search has been cached, the array of job ID’s are mapped to the cached jobs in the JobStore, and the API is not queried.

In retrospect, I could have instead added a rank field to each job as they were received and dynamically recalculated the search results. That would have been a little more space efficient.    

**Debouncing**

To allow the user to select multiple companies in quick succession without calling the API for each selection (which makes the UI laggy), the UI debounces actions that would trigger an API call (company selections and pagination). 

While this improves the lagginess for new queries, a delay of just 500 milliseconds makes the UI feel more laggy than it should for cached queries. A better approach would be to separate the cache lookups from the API queries and only debounce the API queries. For new queries, one could generate intermediate results from cached results and then update the list with any new jobs that arrive after the API call returns.





