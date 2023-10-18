import Organization from "@/modules/organization/organization.entity";
import { DataService } from "../db.service";


export interface OrganizationRepository {
  // findAll(): Promise<Organization[]>;
  // update(filter: Partial<Organization>, update: Partial<Organization>): Promise<void>;
  // create(user: Partial<Organization>): Organization;
  // save(user: Organization): Promise<Organization>;
  // remove(id: number): Promise<void>;
  findOneBy(data: Partial<Organization>): Promise<Organization>;
}

class OrganizationRepoMock implements OrganizationRepository {
  constructor () {
    this.dataService = new DataService()

    this.organizaitons = this.dataService.getTable("organizations");
  }
  private dataService: DataService;
  private organizaitons: Organization[] = [];

  public async findOneBy(data: Partial<Organization>): Promise<Organization> {
    return this.organizaitons.find((organization) => {
      let isTrue = true;

      for (let key in data) {
        if (organization[key] === data[key]) {
          isTrue = false;
        }
      }

      return !isTrue;
    });
  }
}

export default OrganizationRepoMock;
