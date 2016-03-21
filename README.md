**The Muse: Job Search**

This app uses ReactJS and a barebones implementation of flux (using RxJS as the 
dispatcher) to provide basic job browsing for jobs at **themuse.com**.

The notable features are that it indexes job attributes as new jobs are loaded 
(in the IndexStore), it caches job data in memory (in the JobStore), and it 
caches company data in memory (in the CompanyStore).  

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