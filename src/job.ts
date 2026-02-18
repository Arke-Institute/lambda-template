/**
 * Job Processor - Implement your processing logic here
 *
 * This is the main entry point for your processor's business logic.
 * Customize this file for your specific file processing needs.
 *
 * The template provides:
 * - ctx.job: The job record with entity_id, api credentials, options
 * - ctx.updateProgress(): Update progress for polling clients
 * - ctx.updateStatus(): Update job status and phase
 * - ctx.complete(): Mark job as done with result
 * - ctx.fail(): Mark job as failed with error
 * - ctx.trackCreatedEntities(): Track created entity IDs for idempotency
 * - ctx.refreshJob(): Get fresh job state from DynamoDB
 *
 * Available helpers:
 * - lib/arke.ts: ArkeClient, entity/file operations
 * - lib/file-utils.ts: File detection, download, validation
 */

import type { ProcessContext, ProcessResult } from './lib/types.js';
import { createArkeClient, getEntity } from './lib/arke.js';
import { listEntityFiles } from './lib/file-utils.js';

// Uncomment these imports when implementing your processor:
// import type { BaseProgress, BaseResult } from './lib/types.js';
// import { resolveTargetFile, downloadEntityFile, validateFileSize } from './lib/file-utils.js';

// =============================================================================
// Processor Configuration
// =============================================================================

// TODO: Define your accepted file types
// import { PDF_FILTER, JPEG_FILTER, IMAGE_FILTER } from './lib/file-utils.js';
// const ACCEPTED_TYPES = PDF_FILTER;

// TODO: Define your size limit
// const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// =============================================================================
// Custom Types (optional)
// =============================================================================

// TODO: Extend BaseProgress for your processor
// interface MyProgress extends BaseProgress {
//   phase: 'downloading' | 'processing' | 'uploading' | 'complete';
//   items_total?: number;
//   items_processed?: number;
// }

// TODO: Extend BaseResult for your processor
// interface MyResult extends BaseResult {
//   entity_ids: string[];
//   processed_count: number;
// }

// =============================================================================
// Main Processing Function
// =============================================================================

/**
 * Process a job
 *
 * This function is called by the process handler when a job is ready.
 * Implement your file processing logic here.
 *
 * @param ctx - Process context with job data and helper methods
 * @returns Result with entity_ids for workflow handoff
 */
export async function processJob(
  ctx: ProcessContext
): Promise<ProcessResult> {
  const { job } = ctx;

  console.log(`[job] Processing entity ${job.entity_id}`);

  // -------------------------------------------------------------------------
  // Step 1: Create Arke client
  // -------------------------------------------------------------------------
  const client = createArkeClient(job);

  // -------------------------------------------------------------------------
  // Step 2: Get target entity
  // -------------------------------------------------------------------------
  await ctx.updateProgress({ phase: 'downloading' });

  const entity = await getEntity(client, job.entity_id);
  console.log(`[job] Got entity: ${entity.id} (type: ${entity.type})`);

  // -------------------------------------------------------------------------
  // Step 3: Resolve and download file
  // -------------------------------------------------------------------------

  // List files on entity
  const files = listEntityFiles({
    id: entity.id,
    type: entity.type,
    properties: entity.properties as {
      content?: Record<string, {
        cid?: string;
        content_type?: string;
        size?: number;
        uploaded_at?: string;
      }>;
    },
  });

  console.log(`[job] Entity has ${files.length} files:`, files.map(f => f.key));

  // TODO: Resolve target file with your accepted types
  // const file = resolveTargetFile(
  //   { id: entity.id, type: entity.type, properties: entity.properties },
  //   job.target_file_key,
  //   ACCEPTED_TYPES
  // );
  //
  // Validate file size
  // validateFileSize(file, MAX_FILE_SIZE, 'my-processor');
  //
  // Download file content
  // const content = await downloadEntityFile(client, entity.id, file.key);

  // -------------------------------------------------------------------------
  // Step 4: Process the file
  // -------------------------------------------------------------------------
  await ctx.updateProgress({ phase: 'processing' });

  // TODO: Implement your processing logic here
  // Example:
  // const outputs = await myProcessingFunction(content, job.options);
  //
  // Track created entities for idempotency
  // await ctx.trackCreatedEntities(outputs.map(o => o.id));

  // -------------------------------------------------------------------------
  // Step 5: Return results
  // -------------------------------------------------------------------------

  // TODO: Return your result
  // return {
  //   entity_ids: outputs.map(o => o.id),
  //   result: {
  //     entity_ids: outputs.map(o => o.id),
  //     processed_count: outputs.length,
  //   },
  // };

  // Placeholder return
  console.log('[job] Processing complete (placeholder)');

  return {
    entity_ids: [],
    result: {
      entity_ids: [],
    },
  };
}
