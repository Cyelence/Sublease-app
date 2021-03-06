import {
    Arg,
    Ctx,
    Field,
    FieldResolver,
    InputType,
    Int,
    Mutation,

    Query,
    Resolver,
    Root,
    UseMiddleware
} from "type-graphql";
import { getConnection } from "typeorm";
import { Post } from "../entities/Post";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
  
  @InputType()
  class PostInput {
    @Field()
    title: string;
    @Field()
    text: string;
  }
  
  
  @Resolver(Post)
  export class PostResolver {
    @FieldResolver(() => String)
    textSnippet(@Root() post: Post) {
      return post.text.slice(0, 50);
    }

    @Query(() => [Post])
    async posts(
      @Arg("limit", () => Int) limit: number,
      @Arg("cursor", () => String, { nullable: true }) cursor: string | null
    ): Promise<Post[]> {
      // 20 -> 21
      const realLimit = Math.min(50, limit);
        const qb = getConnection()
                    .getRepository(Post)
                    .createQueryBuilder("p")
                    .orderBy('"createdAt"', "DESC")
                    .take(realLimit)
        if (cursor) {
            qb.where('"createdAt" < :cursor', 
            {
                cursor: new Date(cursor),
            })
        }

        return qb.getMany()
    }
  
    @Query(() => Post, { nullable: true })
    post(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
      return Post.findOne(id);
    }
  
    @Mutation(() => Post)
    @UseMiddleware(isAuth)
    async createPost(
      @Arg("input") input: PostInput,
      @Ctx() { req }: MyContext
    ): Promise<Post> {
      return Post.create({
        ...input,
        creatorId: req.session.userId,
      }).save();
    }
}
