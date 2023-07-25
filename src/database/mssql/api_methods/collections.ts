import { Logger } from '@nestjs/common';
import { collectionNameDto } from 'src/api/import.dtos';
import { mssqlCall } from '../bulk-import/fetch';
import { MasterEventDto, SubEventDto } from 'src/transformer/types/category';
import { masterEventQuery, subEventQuery } from '../query';

/**
 * Fetch collections based on the provided collection name filter.
 * @param collectionsFilter - The collection name filter.
 * @returns An array of MasterEventDto if collection name is not provided, or an object containing master event data and sub-events if collection name is provided.
 */
export const fetchCollections = async (
  collectionsFilter: collectionNameDto,
) => {
  try {
    if (!collectionsFilter.collectionName) {
      // If collection name is not provided, fetch all MasterEventDto records.
      return (await mssqlCall(masterEventQuery())) as MasterEventDto[];
    }

    // Fetch the MasterEventDto record based on the collection name.
    const [masterEventData] = (await mssqlCall(
      masterEventQuery(collectionsFilter.collectionName),
    )) as MasterEventDto[];

    if (!masterEventData) {
      // If no master event data found for the provided collection name, return an empty array.
      Logger.warn(
        `No master event data found for collection: ${collectionsFilter.collectionName}`,
      );
      return [];
    }

    // Fetch sub-events based on the retrieved MasterEventDto's TBEventPageMaster_ID.
    const subEvents = (await mssqlCall(
      subEventQuery(masterEventData.TBEventPageMaster_ID),
    )) as SubEventDto[];

    if (subEvents.length === 0) {
      Logger.warn(
        `No sub-events found for collection: ${collectionsFilter.collectionName}`,
      );
    }

    // Return an object containing the master event data and sub-events.
    return { master: masterEventData, subEvents };
  } catch (error) {
    // Log the error and return null to indicate a failure occurred.
    Logger.error(`Error fetching collections: ${error.message}`);
    return `No collections found like collection name ==== '${collectionsFilter.collectionName}'`;
  }
};
