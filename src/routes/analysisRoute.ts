import e, { Router } from "express";

const router = Router();

router.get("analysis/deadliest-attack-types", () => {});

router.get("analysis/highest-casualty-regions", () => {});

router.get("analysis/incident-trends/:years", () => {});

router.get("relationships/top-groups/erea", () => {});

router.get("relationships/groups-by-year/:yearsorgang", () => {});

router.get("relationships/deadliest-regions/:gang", () => {});

export default router