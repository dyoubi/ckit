/**
 * @deprecated
 */
export class DataModel {
	constructor(data?: Partial<DataModel>) {
		if (data) { Object.assign(this, data); }
	}
}

/**
 * @deprecated
 */
export interface IBusinessModel {
	createdAt: Date;
	updatedAt: Date;
}

/**
 * @deprecated
 */
export class BusinessModel extends DataModel
	implements IBusinessModel {
	createdAt: Date;
	updatedAt: Date;
}